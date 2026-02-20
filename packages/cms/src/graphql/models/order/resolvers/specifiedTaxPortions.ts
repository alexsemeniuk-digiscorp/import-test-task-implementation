import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const specifiedTaxPortions: GraphQLFieldResolver<
  NexusGenRootTypes['Order'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<string> => {
  const orderService = strapi.service('api::order.order');
  return await orderService.getSpecifiedTaxPortions(root.id);
};
