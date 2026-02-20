import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const totalItemsPurchased: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<number> => {
  const orderService = strapi.service('api::contact.contact');

  return await orderService.getTotalItemsPurchased(root.id);
};
