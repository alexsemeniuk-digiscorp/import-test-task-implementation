import { GraphQLFieldResolver } from 'graphql';

export const productsPriceRange: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext
> = async (root, data, ctx) => {
  const products = await strapi.entityService.findMany('api::product.product', {
    filters: {
      tenant: ctx.state.tenantId,
      active: true,
    },
    fields: ['defaultPrice'],
    sort: ['createdAt:desc'],
    pagination: { limit: 100 },
  });

  if (!products || products.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const priceList = products
    .map((product) => product.defaultPrice)
    .filter((defaultPrice) => defaultPrice !== null);

  return { minPrice: Math.min(...priceList), maxPrice: Math.max(...priceList) };
};
