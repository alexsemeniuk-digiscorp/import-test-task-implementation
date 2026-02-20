import { GraphQLFieldResolver } from 'graphql';

export const productInventoryItemAgeRange: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext
> = async (root, data, ctx) => {
  const productInventoryItemRecords = await strapi.entityService.findMany(
    'api::invt-itm-record.invt-itm-record',
    {
      filters: {
        tenant: ctx.state.tenantId,
      },
    },
  );

  if (
    !productInventoryItemRecords ||
    productInventoryItemRecords.length === 0
  ) {
    return { minAge: 0, maxAge: 0 };
  }

  const priceList = productInventoryItemRecords
    .map((productItem) => productItem.age)
    .filter((age) => age !== null && age >= 0);

  return { minAge: Math.min(...priceList), maxAge: Math.max(...priceList) };
};
