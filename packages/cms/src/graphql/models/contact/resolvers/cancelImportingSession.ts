import { GraphQLFieldResolver } from 'graphql';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { isProcessingJob } from './../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../api/redis/redis';
import { NexusGenInputs } from './../../../../types/generated/graphql';

export const cancelImportingSession: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CancelImportingSessionInput'] }
> = async (root, { input }, ctx) => {
  const tenantFilter = await getTenantFilter(ctx.state.user.id);

  const lastSession = await strapi.entityService.findMany(
    'api::importing-session.importing-session',
    {
      filters: {
        type: input?.importingIdentifier,
        ...tenantFilter,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  const key = isProcessingJob(
    lastSession?.[0]?.regexedId,
    tenantFilter?.tenant,
  );
  await redis.set(key, 'false');

  await strapi.entityService.update(
    'api::importing-session.importing-session',
    lastSession[0].id,
    {
      data: {
        state: 'completed',
      },
    },
  );

  return { success: true };
};
