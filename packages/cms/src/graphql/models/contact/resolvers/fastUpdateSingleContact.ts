import { GraphQLFieldResolver } from 'graphql';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { CONTACTS_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { singleContactUpdating } from './../../../../graphql/models/contact/helpers/importing/utils/helpers/singleContactUpdating';
import { NexusGenInputs } from './../../../../types/generated/graphql';

export const fastUpdateSingleContact: GraphQLFieldResolver<
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
        type: CONTACTS_IMPORT_IDENTIFIER,
        ...tenantFilter,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  await singleContactUpdating(parsedContact, {
    tenantFilter,
    regexedSessionId: lastSession?.[0]?.regexedId,
  });
};
