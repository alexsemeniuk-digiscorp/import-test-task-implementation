import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const itemsPurchasedInPeriod: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root, args): Promise<number> => {
  if (!args?.data?.gte || !args?.data?.lte) return;

  const orderService = strapi.service('api::contact.contact');

  return await orderService.getTotalItemsPurchased(root.id, [
    new Date(args?.data?.gte).toISOString(),
    new Date(args?.data?.lte).toISOString(),
  ]);
};
