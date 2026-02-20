import { GraphQLFieldResolver } from 'graphql';
import { handleLogger } from '../../../../graphql/helpers/errors';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const isInventoryNotEqualScanned: GraphQLFieldResolver<
  NexusGenRootTypes['InventoryAudit'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  handleLogger(
    'info',
    'INVENTORY AUDIT resolver isInventoryNotEqualScanned',
    '',
  );

  const inventoryAudit = await strapi.entityService.findOne(
    'api::inventory-audit.inventory-audit',
    root.id,
    {
      fields: ['id'],
      populate: {
        inventoryAuditItems: {
          fields: ['id', 'inventoryQty', 'scannedQty'],
        },
      },
    },
  );

  if (!inventoryAudit) return false;

  const inventoryQtyNotEqualScannedQty =
    inventoryAudit.inventoryAuditItems?.filter(
      (item) => item.inventoryQty !== item.scannedQty,
    ) ?? [];

  return inventoryQtyNotEqualScannedQty.length > 0;
};
