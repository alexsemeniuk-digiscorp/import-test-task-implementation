import { GraphQLFieldResolver } from 'graphql';
import { handleLogger } from '../../../../graphql/helpers/errors';

const runInBatches = async (
  items: any[],
  batchSize: number,
  asyncCallback: (item: any) => Promise<void>,
) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    for (const item of batch) {
      await asyncCallback(item);
    }
  }
};

export const updateFinalizeInventoryAudit: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: { uuid: string } }
> = async (_root, args, ctx) => {
  handleLogger(
    'info',
    'INVENTORY AUDIT mutation updateFinalizeInventoryAudit',
    '',
  );

  const uuid = args.input?.uuid;
  if (!uuid) return false;

  const inventoryAuditResults = await strapi.entityService.findMany(
    'api::inventory-audit.inventory-audit',
    {
      filters: { uuid: { $eq: uuid } },
      fields: ['id'],
      populate: {
        inventoryAuditItems: {
          fields: ['id', 'adjusted', 'actualQty', 'inventoryQty', 'scannedQty'],
          populate: {
            sublocationItems: {
              fields: ['id', 'actualQty', 'scannedQty'],
            },
          },
        },
      },
    },
  );

  const inventoryAudit = inventoryAuditResults && inventoryAuditResults[0];
  if (!inventoryAudit) return false;

  const inventoryQtyNotEqualScannedQty =
    inventoryAudit.inventoryAuditItems?.filter(
      (item) => item.inventoryQty !== item.scannedQty,
    ) ?? [];

  const isAdjustmentRequired = inventoryQtyNotEqualScannedQty.length > 0;

  const sublocationItems =
    inventoryAudit.inventoryAuditItems
      ?.map((item) => item?.sublocationItems ?? [])
      .flat() ?? [];

  const updateSublocationItems =
    sublocationItems.map((item) => {
      const scannedQty = item?.scannedQty ?? 0;
      const actualQty = item?.actualQty ?? 0;
      const newScannedAndActualQty = actualQty === 0 ? scannedQty : actualQty;

      return {
        id: item.id,
        scannedQty: newScannedAndActualQty,
        actualQty: newScannedAndActualQty,
      };
    }) ?? [];

  const updatedAuditItems =
    inventoryAudit.inventoryAuditItems?.map((item) => {
      const scannedQty = item?.scannedQty ?? 0;
      const actualQty = item?.actualQty ?? 0;
      const inventoryQty = item?.inventoryQty ?? 0;
      const newScannedAndActualQty = actualQty === 0 ? scannedQty : actualQty;

      return {
        id: item.id,
        scannedQty: newScannedAndActualQty,
        actualQty: newScannedAndActualQty,
        adjusted: inventoryQty !== newScannedAndActualQty,
      };
    }) ?? [];

  try {
    await runInBatches(updatedAuditItems, 50, async (item) => {
      if (!item.id) return;
      await strapi.entityService.update(
        'api::inventory-audit-item.inventory-audit-item',
        item.id,
        {
          data: {
            adjusted: item.adjusted,
            scannedQty: item.scannedQty,
            actualQty: item.actualQty,
          },
        },
      );
    });

    await runInBatches(updateSublocationItems, 50, async (item) => {
      if (!item.id) return;
      await strapi.entityService.update(
        'api::sublocation-item.sublocation-item',
        item.id,
        {
          data: {
            actualQty: item.actualQty,
            scannedQty: item.scannedQty,
          },
        },
      );
    });

    await strapi.entityService.update(
      'api::inventory-audit.inventory-audit',
      inventoryAudit.id,
      {
        data: {
          finalize: true,
          isAdjustmentRequired: isAdjustmentRequired,
        },
      },
    );

    return true;
  } catch (error) {
    handleLogger('error', 'updateFinalizeInventoryAudit error', error);
    return false;
  }
};
