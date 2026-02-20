import { GraphQLFieldResolver } from 'graphql';

import {
  NexusGenInputs,
  NexusGenRootTypes,
} from '../../../../types/generated/graphql';
import { importingMetadata } from './../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../api/redis/redis';
import { getPaginatedCreations } from './../../../../graphql/models/contact/helpers/importing/utils/utils';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

export const getSessionImportingContacts: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  { input: NexusGenInputs['SessionImportingInput'] }
> = async (root, args, ctx): Promise<string> => {
  if (!args?.input?.generatedRegex) return '{}';
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  const { data: spoiledCreations, total: spoiledCreationsTotal } =
    await getPaginatedCreations({
      type: 'spoiledCreations',
      page: args?.input?.completedData?.page,
      pageSize: args?.input?.spoiledData?.pageSize,
      generatedRegex: args?.input?.generatedRegex,
      tenantId: tenantFilter?.tenant,
      importIdentifier: args?.input?.importingIdentifier,
    });
  const { data: updatedCreations, total: updatedCreationsTotal } =
    await getPaginatedCreations({
      type: 'updatedCreations',
      page: args?.input?.updatedData?.page,
      pageSize: args?.input?.updatedData?.pageSize,
      generatedRegex: args?.input?.generatedRegex,
      tenantId: tenantFilter?.tenant,
      importIdentifier: args?.input?.importingIdentifier,
    });
  const { data: completedCreations, total: completedCreationsTotal } =
    await getPaginatedCreations({
      type: 'completedCreations',
      page: args?.input?.completedData?.page,
      pageSize: args?.input?.completedData?.pageSize,
      generatedRegex: args?.input?.generatedRegex,
      tenantId: tenantFilter?.tenant,
      importIdentifier: args?.input?.importingIdentifier,
    });

  const metadata = await redis.hgetall(
    importingMetadata(
      args?.input?.generatedRegex,
      tenantFilter?.tenant,
      args?.input?.importingIdentifier,
    ),
  );

  return JSON.stringify({
    completedCreations,
    completedCreationsTotal,
    updatedCreations,
    updatedCreationsTotal,
    spoiledCreations,
    spoiledCreationsTotal,
    metadata,
  });
};
