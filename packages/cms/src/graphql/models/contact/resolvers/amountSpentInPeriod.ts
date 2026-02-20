import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

export const amountSpentInPeriod: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root, args, ctx): Promise<number> => {
  if (!args?.data?.gte || !args?.data?.lte) return;

  const contactService = strapi.service('api::contact.contact');
  const tenantFilter = await getTenantFilter(ctx.state.user.id);

  return await contactService.getContactTotalSpent(
    root.id,
    [
      new Date(args?.data?.gte).toISOString(),
      new Date(args?.data?.lte).toISOString(),
    ],
    'contact',
    tenantFilter?.tenant,
  );
};
