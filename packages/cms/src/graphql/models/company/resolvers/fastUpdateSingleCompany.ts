import { GraphQLFieldResolver } from 'graphql';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { COMPANIES_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { singleCompanyUpdating } from './helpers/helpers';

export const fastUpdateSingleCompany: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['FastUpdateSingleContactInput'] }
> = async (root, { input }, ctx) => {
  const parsedContact = JSON.parse(input?.csvSingleContactJson);
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  const lastSession = await strapi.entityService.findMany(
    'api::importing-session.importing-session',
    {
      filters: {
        type: COMPANIES_IMPORT_IDENTIFIER,
        ...tenantFilter,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  await singleCompanyUpdating(parsedContact, {
    tenantFilter,
    regexedSessionId: lastSession?.[0]?.regexedId,
  });
};
