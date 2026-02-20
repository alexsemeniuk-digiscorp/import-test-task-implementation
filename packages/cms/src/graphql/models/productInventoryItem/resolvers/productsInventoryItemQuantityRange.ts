import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';

export const productsInventoryItemQuantityRange: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { businessLocationId: ID }
> = async (root, { businessLocationId }) => {
  const productInventoryItems = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        businessLocation: { id: businessLocationId },
      },
      fields: ['quantity'],
      sort: ['createdAt:desc'],
      pagination: { limit: 100 },
    },
  );

  if (!productInventoryItems || productInventoryItems.length === 0) {
    return { minQuantity: 0, maxQuantity: 0 };
  }

  const quantityList = productInventoryItems
    .map((product) => product.quantity)
    .filter((quantity) => quantity !== null);

  return {
    minQuantity: Math.min(...quantityList),
    maxQuantity: Math.max(...quantityList),
  };
};
