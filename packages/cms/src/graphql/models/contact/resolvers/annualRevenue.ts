import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const annualRevenue: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root, args): Promise<number> => {
  const orderService = strapi.service('api::contact.contact');

  const startDate = new Date(new Date().getFullYear(), 0, 1);

  const dateRange = [startDate.toISOString(), new Date().toISOString()];

  return await orderService.getContactTotalSpent(root.id, dateRange);
};
