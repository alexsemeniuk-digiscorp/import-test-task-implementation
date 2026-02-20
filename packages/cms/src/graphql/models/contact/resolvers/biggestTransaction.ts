import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const biggestTransaction: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root): Promise<number> => {
  const orderService = strapi.service('api::contact.contact');

  return await orderService.getBiggestTransaction(root.id);
};
