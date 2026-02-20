import { GraphQLFieldResolver } from 'graphql';

import {
  NexusGenInputs,
  NexusGenRootTypes,
} from '../../../../types/generated/graphql';

export const soldRevenue: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { input: NexusGenInputs['SoldRevenueInput'] }
> = async (root, args) => {
  const { startDate, endDate, businessLocationId } = args.input;

  const productService = strapi.service('api::product.product');

  return productService.getSoldRevenue(
    root.id,
    startDate,
    endDate,
    businessLocationId,
  );
};
