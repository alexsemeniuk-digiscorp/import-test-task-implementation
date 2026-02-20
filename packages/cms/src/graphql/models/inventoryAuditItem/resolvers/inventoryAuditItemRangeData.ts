import { GraphQLFieldResolver } from 'graphql';

import { handleLogger } from '../../../helpers/errors';

export const inventoryAuditItemRangeData: GraphQLFieldResolver<
  null,
  { uuid: string },
  Graphql.ResolverContext
> = async (root, { uuid }, ctx) => {
  if (!uuid) return null;

  handleLogger(
    'info',
    'Resolver :: inventoryAuditItemRangeData',
    `UUID: ${uuid}`,
  );

  const res = await strapi.entityService.findMany(
    'api::inventory-audit-item.inventory-audit-item',
    {
      filters: {
        inventoryAudit: {
          uuid: {
            $eq: uuid,
          },
        },
      },
      populate: {
        fields: ['scannedQty', 'actualQty', 'inventoryQty'],
        productInventoryItem: {
          fields: ['price'],
          populate: {
            product: {
              fields: ['defaultPrice'],
            },
          },
        },
      } as any,
    },
  );

  const scannedQtys = res.map((item) => item.scannedQty);
  const actualQtys = res.map((item) => item.actualQty);
  const inventoryQtys = res.map((item) => item.inventoryQty);
  const prices = res.map(
    (item) => (item as any).productInventoryItem?.product?.defaultPrice || 0,
  );

  const minScannedQty = Math.min(...scannedQtys);
  const maxScannedQty = Math.max(...scannedQtys);

  const minActualQty = Math.min(...actualQtys);
  const maxActualQty = Math.max(...actualQtys);

  const minInventoryQty = Math.min(...inventoryQtys);
  const maxInventoryQty = Math.max(...inventoryQtys);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const result = {
    minScannedQty,
    maxScannedQty,
    minActualQty,
    maxActualQty,
    minInventoryQty,
    maxInventoryQty,
    minPrice,
    maxPrice,
  };

  return (
    result || {
      minScannedQty: 0,
      maxScannedQty: 0,
      minActualQty: 0,
      maxActualQty: 0,
      minInventoryQty: 0,
      maxInventoryQty: 0,
      minPrice: 0,
      maxPrice: 0,
    }
  );
};
