import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

export const calculatedSpent: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root, args, ctx): Promise<number> => {
  const contactService = strapi.service('api::contact.contact');
  const tenantFilter = await getTenantFilter(ctx.state.user.id);
  return await contactService.getContactTotalSpent(
    root.id,
    undefined,
    'contact',
    tenantFilter?.tenant,
  );
};
