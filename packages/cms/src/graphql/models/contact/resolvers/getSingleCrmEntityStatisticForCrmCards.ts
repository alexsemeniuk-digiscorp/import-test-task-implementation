import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

export const getSingleContactStatisticForCrmCards: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CrmSingleCardTotalsInput'] }
> = async (root, { input }, ctx): Promise<number> => {
  const contactService = strapi.service('api::contact.contact');
  const tenantFilters = await getTenantFilter(ctx.state.user.id, true);
  const tenantId = tenantFilters?.tenant;
  const tenantSlug = tenantFilters?.tenantFullInfo?.slug;

  return await contactService.getSingleCrmEntityStatisticForCrmCards(
    'contact',
    input.customerId,
    tenantId,
    tenantSlug,
  );
};
