import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const productsPortion: GraphQLFieldResolver<
  NexusGenRootTypes['Order'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<number> => {
  const orderService = strapi.service('api::order.order');

  return orderService.getProductsPortion(root.id);
};
