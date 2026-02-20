import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const specifiedTaxPortionsAdjustedPrices: GraphQLFieldResolver<
  NexusGenRootTypes['Order'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  const orderService = strapi.service('api::order.order');
  return await orderService.getSpecifiedTaxPortionsAdjustedPrices(root.id);
};
