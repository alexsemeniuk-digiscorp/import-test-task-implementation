import { QueueService } from '../../../../../api/redis/services/QueueService';
import {
  CREATING_INVENTORY_AUDIT_IDENTIFIER,
  CREATING_INVENTORY_AUDIT_ITEM_IDENTIFIER,
} from '../constants/inventoryAudit.constants';

import {
  auditItemProcessor,
  inventoryAuditProccessor,
} from '../worker/indentoryAudit.worker';

export const creatingAuditQueueService = new QueueService(
  CREATING_INVENTORY_AUDIT_IDENTIFIER,
  inventoryAuditProccessor,
  {
    concurrency: 5,
    logCompleted: true,
    lockDuration: 60000,
    autorun: true,
    useWorkerThreads: true,
  },
);

export const creatingAuditItemQueueService = new QueueService(
  CREATING_INVENTORY_AUDIT_ITEM_IDENTIFIER,
  auditItemProcessor,
  {
    concurrency: 5,
    autorun: true,
    useWorkerThreads: true,
  },
);

//TODO Additional versions below
/* optimized version */
/*
*
* export const auditItemProcessor = async (job: Job<any>) => {
  const {
    items,
    inventoryAuditId,
    tenantId,
    businessLocationId,
    sublocationId,
  } = job.data;

  const knex = strapi.db.connection;
  const now = new Date().toISOString();

  // 1. Загружаем все существующие productInventoryItemId для этого inventoryAuditId ОДНИМ запросом
  const existingLinks = await knex('inventory_audit_items_product_inventory_item_links')
    .join('inventory_audit_items_inventory_audit_links', 'inventory_audit_items_product_inventory_item_links.inventory_audit_item_id', 'inventory_audit_items_inventory_audit_links.inventory_audit_item_id')
    .where('inventory_audit_items_inventory_audit_links.inventory_audit_id', inventoryAuditId)
    .select('inventory_audit_items_product_inventory_item_links.product_inventory_item_id');

  const existingProductInventoryItemIds = new Set(existingLinks.map(link => link.product_inventory_item_id));

  const itemsToInsert = [];

  for (const item of items) {
    const productInventoryItemId = sublocationId
      ? item.productInventoryItem?.id
      : item.id;

    if (existingProductInventoryItemIds.has(productInventoryItemId)) {
      console.log(`Audit item already exists for productInventoryItemId: ${productInventoryItemId}, inventoryAuditId: ${inventoryAuditId}`);
      continue; // Пропускаем создание
    }

    const auditItemId = generateId();

    itemsToInsert.push({
      auditItemId,
      productInventoryItemId,
      itemQuantity: item.quantity,
    });
  }

  // 2. Массовая вставка новых айтемов
  for (const batch of chunkArray(itemsToInsert, 50)) {
    const inserted = await knex('inventory_audit_items')
      .insert(
        batch.map(({ auditItemId, itemQuantity }) => ({
          inventory_qty: itemQuantity,
          actual_qty: 0,
          scanned_qty: 0,
          audit_item_id: auditItemId,
          created_at: now,
          updated_at: now,
        })),
        ['id', 'audit_item_id']
      );

    for (let i = 0; i < inserted.length; i++) {
      const auditItemRowId = typeof inserted[i] === 'object' ? inserted[i].id : inserted[i];
      const auditItemId = batch[i].auditItemId;
      const productInventoryItemId = batch[i].productInventoryItemId;

      await knex('inventory_audit_items_tenant_links').insert({
        inventory_audit_item_id: auditItemRowId,
        tenant_id: tenantId,
      });

      await knex('inventory_audit_items_inventory_audit_links').insert({
        inventory_audit_item_id: auditItemRowId,
        inventory_audit_id: inventoryAuditId,
      });

      await knex('inventory_audit_items_product_inventory_item_links').insert({
        inventory_audit_item_id: auditItemRowId,
        product_inventory_item_id: productInventoryItemId,
      });

      await knex('inventory_audit_items_business_location_links').insert({
        inventory_audit_item_id: auditItemRowId,
        business_location_id: businessLocationId,
      });

      if (sublocationId) {
        await knex('inventory_audit_items_sublocation_links').insert({
          inventory_audit_item_id: auditItemRowId,
          sublocation_id: sublocationId,
        });

        if (productInventoryItemId) {
          await knex('inventory_audit_items_sublocation_items_links').insert({
            inventory_audit_item_id: auditItemRowId,
            sublocation_item_id: productInventoryItemId,
          });
        }
      }
    }
  }
};

// Вспомогательная функция для разбивки массива на чанки
function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

*
* */

/* more improved version */
/*
* export const auditItemProcessor = async (job: Job<any>) => {
  const { items, inventoryAuditId, tenantId, businessLocationId, sublocationId } = job.data;
  const knex = strapi.db.connection;
  const now = new Date().toISOString();

  const existingLinks = await knex('inventory_audit_items_product_inventory_item_links')
    .join('inventory_audit_items_inventory_audit_links', 'inventory_audit_items_product_inventory_item_links.inventory_audit_item_id', 'inventory_audit_items_inventory_audit_links.inventory_audit_item_id')
    .where('inventory_audit_items_inventory_audit_links.inventory_audit_id', inventoryAuditId)
    .select('inventory_audit_items_product_inventory_item_links.product_inventory_item_id');

  const existingProductInventoryItemIds = new Set(existingLinks.map(link => link.product_inventory_item_id));

  const newItems = [];

  for (const item of items) {
    const productInventoryItemId = sublocationId ? item.productInventoryItem?.id : item.id;
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
      batch.map(item => ({
        inventory_qty: item.inventoryQty,
        actual_qty: item.actualQty,
        scanned_qty: item.scannedQty,
        audit_item_id: item.auditItemId,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })),
      ['id', 'audit_item_id']
    );

    const linkInserts = [];

    for (let idx = 0; idx < insertedItems.length; idx++) {
      const auditItemRow = insertedItems[idx];
      const auditItemRowId = typeof auditItemRow === 'object' ? auditItemRow.id : auditItemRow;
      const newItem = batch[idx];

      linkInserts.push(
        knex('inventory_audit_items_tenant_links').insert({
          inventory_audit_item_id: auditItemRowId,
          tenant_id: tenantId,
        }),
        knex('inventory_audit_items_inventory_audit_links').insert({
          inventory_audit_item_id: auditItemRowId,
          inventory_audit_id: inventoryAuditId,
        }),
        knex('inventory_audit_items_product_inventory_item_links').insert({
          inventory_audit_item_id: auditItemRowId,
          product_inventory_item_id: newItem.productInventoryItemId,
        }),
        knex('inventory_audit_items_business_location_links').insert({
          inventory_audit_item_id: auditItemRowId,
          business_location_id: businessLocationId,
        })
      );

      if (sublocationId) {
        linkInserts.push(
          knex('inventory_audit_items_sublocation_links').insert({
            inventory_audit_item_id: auditItemRowId,
            sublocation_id: sublocationId,
          })
        );

        if (newItem.productInventoryItemId) {
          linkInserts.push(
            knex('inventory_audit_items_sublocation_items_links').insert({
              inventory_audit_item_id: auditItemRowId,
              sublocation_item_id: newItem.productInventoryItemId,
            })
          );
        }
      }
    }

    await Promise.all(linkInserts);
  }
};
* */

/* insert to DB */
/*
* export const auditItemProcessor = async (job: Job<any>) => {
  const { items, inventoryAuditId, tenantId, businessLocationId, sublocationId } = job.data;
  const knex = strapi.db.connection;
  const now = new Date().toISOString();

  const existingLinks = await knex('inventory_audit_items_product_inventory_item_links')
    .join('inventory_audit_items_inventory_audit_links', 'inventory_audit_items_product_inventory_item_links.inventory_audit_item_id', 'inventory_audit_items_inventory_audit_links.inventory_audit_item_id')
    .where('inventory_audit_items_inventory_audit_links.inventory_audit_id', inventoryAuditId)
    .select('inventory_audit_items_product_inventory_item_links.product_inventory_item_id');

  const existingProductInventoryItemIds = new Set(existingLinks.map(link => link.product_inventory_item_id));

  const newItems = [];

  for (const item of items) {
    const productInventoryItemId = sublocationId ? item.productInventoryItem?.id : item.id;
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
      batch.map(item => ({
        inventory_qty: item.inventoryQty,
        actual_qty: item.actualQty,
        scanned_qty: item.scannedQty,
        audit_item_id: item.auditItemId,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })),
      ['id', 'audit_item_id']
    );

    const tenantLinks = [];
    const auditLinks = [];
    const productLinks = [];
    const businessLocationLinks = [];
    const sublocationLinks = [];
    const sublocationItemLinks = [];

    for (let idx = 0; idx < insertedItems.length; idx++) {
      const auditItemRow = insertedItems[idx];
      const auditItemRowId = typeof auditItemRow === 'object' ? auditItemRow.id : auditItemRow;
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
      knex('inventory_audit_items_product_inventory_item_links').insert(productLinks),
      knex('inventory_audit_items_business_location_links').insert(businessLocationLinks),
      sublocationLinks.length ? knex('inventory_audit_items_sublocation_links').insert(sublocationLinks) : Promise.resolve(),
      sublocationItemLinks.length ? knex('inventory_audit_items_sublocation_items_links').insert(sublocationItemLinks) : Promise.resolve(),
    ]);
  }
};
* */
