import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';

export const productsInventoryItemPriceRange: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { id: ID }
> = async (root, { id }) => {
  const products = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        businessLocation: { id },
        active: true,
      },
      fields: ['price'],
      sort: ['createdAt:desc'],
      pagination: { limit: 100 },
    },
  );

  if (!products || products.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const priceList = products
    .map((product) => product.price)
    .filter((price) => price !== null);

  return { minPrice: Math.min(...priceList), maxPrice: Math.max(...priceList) };
};
