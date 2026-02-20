import { GraphQLFieldResolver } from 'graphql';

import {
  NexusGenInputs,
  NexusGenRootTypes,
} from '../../../../types/generated/graphql';
import {
  importingProcessedFieldsCount,
  importingTotalFieldsCount,
} from './../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../api/redis/redis';
import { getTenantFilter } from './../../../models/dealTransaction/helpers/helpers';

export const getSessionImportingContactsProcessInfo: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  { input: NexusGenInputs['SessionImportingProcessInfoInput'] }
> = async (root, args, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  const regexedId = args?.input?.generatedRegex;
  if (!regexedId) return '{}';
  const totalFields =
    (await redis.get(
      importingTotalFieldsCount(
        regexedId,
        tenantFilter?.tenant,
        args?.input?.importingIdentifier,
      ),
    )) ?? 0;
  const processedFields =
    (await redis.get(
      importingProcessedFieldsCount(
        regexedId,
        tenantFilter?.tenant,
        args?.input?.importingIdentifier,
      ),
    )) ?? 0;

  return { totalFields: +totalFields, processedFields: +processedFields };
};
