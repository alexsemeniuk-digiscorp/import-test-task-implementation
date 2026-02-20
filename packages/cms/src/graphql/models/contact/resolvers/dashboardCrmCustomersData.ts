import { GraphQLFieldResolver } from 'graphql';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

export const dashboardCrmCustomersData: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  null
> = async (root, input, ctx): Promise<number> => {
  const contactService = strapi.service('api::contact.contact');
  const tenantId = (await getTenantFilter(ctx.state.user.id))?.tenant;

  return await contactService.dashboardCrmCustomersData(tenantId);
};
