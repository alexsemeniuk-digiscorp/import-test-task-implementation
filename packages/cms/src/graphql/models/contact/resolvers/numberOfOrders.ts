import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const numberOfOrders: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<number> => {
  const orderService = strapi.service('api::contact.contact');

  return await orderService.getNumberOfOrders(root.id);
};
