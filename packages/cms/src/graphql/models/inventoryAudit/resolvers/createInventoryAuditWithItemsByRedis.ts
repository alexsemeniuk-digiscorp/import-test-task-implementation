import { GraphQLFieldResolver } from 'graphql';
import { handleError, handleLogger } from '../../../helpers/errors';
import { CreateInventoryAuditWithItemsInput } from '../../inventoryAuditItem/inventoryAuditItem.types';
import { CREATING_INVENTORY_AUDIT_IDENTIFIER } from '../redis/constants/inventoryAudit.constants';
import {
  creatingAuditItemQueueService,
  creatingAuditQueueService,
} from '../redis/queues/inventoryAuditCreate.queue';

import { generateId } from '../../../../utils/randomBytes';

interface CreateAuditChunksOptions {
  filteredItems: any[];
  chunkSize: number;
  creatingAuditItemQueueService: any;
  creatingAuditQueueService: any;
  inventoryAudit: string | number;
  tenant: number | string;
  businessLocation: number | string;
  sublocationId?: number | string;
}
const CHUNK_SIZE = 50;

export async function createAuditChunksAndWait({
  filteredItems,
  chunkSize,
  creatingAuditItemQueueService,
  creatingAuditQueueService,
  inventoryAudit,
  tenant,
  businessLocation,
  sublocationId,
}: CreateAuditChunksOptions): Promise<void> {
  const chunkJobs = [];

  for (let i = 0; i < filteredItems.length; i += chunkSize) {
    const chunk = filteredItems.slice(i, i + chunkSize);

    chunkJobs.push({
      name: 'create-audit-item-chunk',
      queueName: creatingAuditItemQueueService.getQueue().name,
      data: {
        items: chunk,
        inventoryAuditId: inventoryAudit,
        tenantId: Number(tenant),
        businessLocationId: Number(businessLocation),
        sublocationId: sublocationId ? Number(sublocationId) : undefined,
      },
    });
  }

  const job = await creatingAuditQueueService.addFlowJob(
    CREATING_INVENTORY_AUDIT_IDENTIFIER,
    {
      items: filteredItems,
      inventoryAuditId: inventoryAudit,
      tenantId: Number(tenant),
      businessLocationId: Number(businessLocation),
      sublocationId: sublocationId ? Number(sublocationId) : undefined,
      totalItems: filteredItems.length,
    },
    chunkJobs,
    {
      jobId: `creating_audit_${inventoryAudit}`,
    },
  );

  await job.job.waitUntilFinished(creatingAuditQueueService.getEvents());
}

async function createInventoryAuditItemsInBatches(
  items: any[],
  inventoryAuditId: number,
  tenantId: number,
  businessLocationId: number,
  sublocationId?: number,
) {
  const batches = [];
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    batches.push(items.slice(i, i + CHUNK_SIZE));
  }

  const results = [];
  for (const batch of batches) {
    try {
      const batchPromises = batch.map((item) => {
        const data: {
          tenant: number;
          inventoryQty: any;
          actualQty: number;
          scannedQty: number;
          productInventoryItem: any;
          businessLocation: number;
          inventoryAudit: number;
          auditItemId: string;
          sublocation?: number;
          sublocationItems?: number[];
        } = {
          tenant: tenantId,
          inventoryQty: item.quantity,
          actualQty: 0,
          scannedQty: 0,
          productInventoryItem: sublocationId
            ? item.productInventoryItem?.id
            : item.id,
          businessLocation: businessLocationId,
          inventoryAudit: inventoryAuditId,
          auditItemId: generateId(),
        };

        if (sublocationId) {
          data.sublocation = sublocationId;
          data.sublocationItems = [item.id];
        }

        return strapi.entityService.create(
          'api::inventory-audit-item.inventory-audit-item',
          { data },
        );
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    } catch (error) {
      handleError(
        'Resolver :: CreateInventoryAuditWithItems',
        `Error creating batch: ${error.message}`,
        error,
      );
      throw error;
    }
  }
  return results;
}

export const createInventoryAuditWithItemsByRedis: GraphQLFieldResolver<
  null,
  null,
  { input: CreateInventoryAuditWithItemsInput }
> = async (_, { input }) => {
  handleLogger(
    'info',
    'Resolver :: createInventoryAuditWithItemsByRedis',
    `Params: ${JSON.stringify(input)}`,
  );
  const {
    auditDate,
    auditId,
    businessLocation,
    employee,
    name,
    sublocation: sublocationId,
    tenant,
    productType,
    company,
    contact,
    inventoryQty,
  } = input;

  const inventoryAudit = await strapi.entityService.create(
    'api::inventory-audit.inventory-audit',
    {
      data: {
        auditDate,
        auditId,
        businessLocation,
        employee,
        name,
        sublocation: sublocationId,
        tenant,
      },
    },
  );

  if (!inventoryAudit) {
    return handleError(
      'Resolver :: CreateInventoryAuditWithItems',
      '',
      new Error('Inventory Audit has not been created'),
    );
  }
  const filters: any = {
    businessLocation: {
      id: businessLocation,
    },
    tenant: {
      id: tenant,
    },
  };
  if (inventoryQty === false) {
    filters.quantity = { $gte: 1 };
  } else {
    filters.quantity = { $gte: 0 };
  }

  if (sublocationId) {
    const sublocationItems = await strapi.entityService.findMany(
      'api::sublocation-item.sublocation-item',
      {
        filters: {
          sublocation: { id: sublocationId },
          productInventoryItem: {
            ...filters,
          },
        },
        populate: {
          tenant: true,
          businessLocation: true,
          productInventoryItem: {
            populate: {
              product: {
                populate: ['productType'],
              },
              vendor: true,
            },
          },
          sublocation: true,
        },
      },
    );

    const filteredSublocationItems = sublocationItems.filter(
      ({ productInventoryItem }) => {
        const isVendorMatch =
          company || contact
            ? productInventoryItem?.vendor?.id == company
            : true;
        const isProductTypeMatch = productType
          ? productInventoryItem?.product?.productType?.id == productType
          : true;
        return isVendorMatch && isProductTypeMatch;
      },
    );

    if (filteredSublocationItems.length === 0) {
      return;
    }
    if (filteredSublocationItems.length > 50) {
      await createAuditChunksAndWait({
        filteredItems: filteredSublocationItems,
        chunkSize: CHUNK_SIZE,
        creatingAuditItemQueueService,
        creatingAuditQueueService,
        inventoryAudit: inventoryAudit.id,
        tenant,
        businessLocation,
        sublocationId,
      });
    } else {
      // Create inventoryAuditItems
      await createInventoryAuditItemsInBatches(
        filteredSublocationItems,
        inventoryAudit?.id as number,
        tenant as number,
        businessLocation as number,
        sublocationId as number,
      );
    }
  } else {
    const items = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters,
        populate: {
          product: { populate: { productType: true } },
          vendor: true,
          sublocation: true,
          sublocationItems: true,
        },
      },
    );

    const filteredItems = items.filter((item) => {
      const isVendorMatch =
        company || contact ? item?.vendor?.id == company : true;
      const isProductTypeMatch = productType
        ? item?.product?.productType?.id == productType
        : true;
      return isVendorMatch && isProductTypeMatch;
    });

    if (filteredItems.length === 0) {
      return;
    }

    await createAuditChunksAndWait({
      filteredItems,
      chunkSize: CHUNK_SIZE,
      creatingAuditItemQueueService,
      creatingAuditQueueService,
      inventoryAudit: inventoryAudit.id,
      tenant,
      businessLocation,
      sublocationId,
    });
  }

  return { id: String(inventoryAudit.id) };
};
