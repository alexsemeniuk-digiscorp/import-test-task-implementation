import { Job } from 'bullmq';
import { generateId } from '../../../../../utils/randomBytes';
import { creatingAuditItemQueueService } from '../queues/inventoryAuditCreate.queue';

export const inventoryAuditProccessor = async (job: Job<any>) => {
  const {
    items,
    inventoryAuditId,
    tenantId,
    businessLocationId,
    sublocationId,
  } = job.data;

  const CHUNK_SIZE = 50;
  let completed = 0;
  const total = Math.ceil(items.length / CHUNK_SIZE);

  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);

    const subJob = await creatingAuditItemQueueService.addJob(
      'create-audit-item-chunk',
      {
        items: chunk,
        inventoryAuditId,
        tenantId,
        businessLocationId,
        sublocationId,
      },
    );

    await subJob.waitUntilFinished(creatingAuditItemQueueService.getEvents());
    completed++;
    await job.updateProgress(Math.round((completed / total) * 100));
  }

  await job.updateProgress(100);
};

export const auditItemProcessor = async (job: Job<any>) => {
  const {
    items,
    inventoryAuditId,
    tenantId,
    businessLocationId,
    sublocationId,
  } = job.data;
  const knex = strapi.db.connection;
  const now = new Date().toISOString();

  const existingLinks = await knex(
    'inventory_audit_items_product_inventory_item_links',
  )
    .join(
      'inventory_audit_items_inventory_audit_links',
      'inventory_audit_items_product_inventory_item_links.inventory_audit_item_id',
      'inventory_audit_items_inventory_audit_links.inventory_audit_item_id',
    )
    .where(
      'inventory_audit_items_inventory_audit_links.inventory_audit_id',
      inventoryAuditId,
    )
    .select(
      'inventory_audit_items_product_inventory_item_links.product_inventory_item_id',
    );

  const existingProductInventoryItemIds = new Set(
    existingLinks.map((link) => link.product_inventory_item_id),
  );

  const newItems = [];

  for (const item of items) {
    const productInventoryItemId = sublocationId
      ? item.productInventoryItem?.id
      : item.id;
    if (existingProductInventoryItemIds.has(productInventoryItemId)) {
      continue;
    }
    const auditItemId = generateId();
    newItems.push({
      auditItemId,
      inventoryQty: item.quantity,
      actualQty: 0,
      scannedQty: 0,
      createdAt: now,
      updatedAt: now,
      productInventoryItemId,
    });
  }

  if (newItems.length === 0) return;

  const BATCH_SIZE = 500;
  for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
    const batch = newItems.slice(i, i + BATCH_SIZE);

    const insertedItems = await knex('inventory_audit_items').insert(
      batch.map((item) => ({
        inventory_qty: item.inventoryQty,
        actual_qty: item.actualQty,
        scanned_qty: item.scannedQty,
        audit_item_id: item.auditItemId,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })),
      ['id', 'audit_item_id'],
    );

    const tenantLinks = [];
    const auditLinks = [];
    const productLinks = [];
    const businessLocationLinks = [];
    const sublocationLinks = [];
    const sublocationItemLinks = [];

    for (let idx = 0; idx < insertedItems.length; idx++) {
      const auditItemRow = insertedItems[idx];
      const auditItemRowId =
        typeof auditItemRow === 'object' ? auditItemRow.id : auditItemRow;
      const newItem = batch[idx];

      tenantLinks.push({
        inventory_audit_item_id: auditItemRowId,
        tenant_id: tenantId,
      });

      auditLinks.push({
        inventory_audit_item_id: auditItemRowId,
        inventory_audit_id: inventoryAuditId,
      });

      productLinks.push({
        inventory_audit_item_id: auditItemRowId,
        product_inventory_item_id: newItem.productInventoryItemId,
      });

      businessLocationLinks.push({
        inventory_audit_item_id: auditItemRowId,
        business_location_id: businessLocationId,
      });

      if (sublocationId) {
        sublocationLinks.push({
          inventory_audit_item_id: auditItemRowId,
          sublocation_id: sublocationId,
        });

        if (newItem.productInventoryItemId) {
          sublocationItemLinks.push({
            inventory_audit_item_id: auditItemRowId,
            sublocation_item_id: newItem.productInventoryItemId,
          });
        }
      }
    }

    await Promise.all([
      knex('inventory_audit_items_tenant_links').insert(tenantLinks),
      knex('inventory_audit_items_inventory_audit_links').insert(auditLinks),
      knex('inventory_audit_items_product_inventory_item_links').insert(
        productLinks,
      ),
      knex('inventory_audit_items_business_location_links').insert(
        businessLocationLinks,
      ),
      sublocationLinks.length
        ? knex('inventory_audit_items_sublocation_links').insert(
            sublocationLinks,
          )
        : Promise.resolve(),
      sublocationItemLinks.length
        ? knex('inventory_audit_items_sublocation_items_links').insert(
            sublocationItemLinks,
          )
        : Promise.resolve(),
    ]);
  }
};
