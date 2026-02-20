import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { handleLogger } from '../../../helpers/errors';
import redis from './../../../../api/redis/redis';

export const fetchListByFieldFromInventoryAuditItems: GraphQLFieldResolver<
  undefined,
  unknown,
  {
    uuid: string;
    skip?: boolean;
  }
> = async (
  source: undefined,
  input,
  context: unknown,
  info: GraphQLResolveInfo,
) => {
  handleLogger(
    'info',
    'Resolver :: fetchListByFieldFromInventoryAuditItems',
    `Input :: ${JSON.stringify(input)}`,
  );
  const { uuid } = input;

  const cacheKey = `fetchListByFieldFromInventoryAuditItems:${uuid}`;

  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const inventoryAuditItemsFields = await strapi.entityService.findMany(
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
        productInventoryItem: {
          populate: {
            product: {
              fields: ['name', 'barcode'],
            },
          },
        },
      },
    },
  );

  const names =
    inventoryAuditItemsFields.map(
      (field) => field?.productInventoryItem?.product?.name,
    ) || [];
  const barcodes =
    inventoryAuditItemsFields.map(
      (field) => field?.productInventoryItem?.product?.barcode,
    ) || [];

  await redis.set(cacheKey, JSON.stringify({ names, barcodes }), 'EX', 3600);

  return { names, barcodes };
};
