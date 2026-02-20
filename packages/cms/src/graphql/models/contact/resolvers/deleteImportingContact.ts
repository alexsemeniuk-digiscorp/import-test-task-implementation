import { GraphQLFieldResolver } from 'graphql';
import redis from '../../../../api/redis/redis';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import {
  completedImportingData,
  spoiledImportingData,
  updatingImportingData,
} from './../../../../api/redis/helpers/variables/importingVariables';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { handleLogger } from './../../../helpers/errors';

export const deleteImportingContact: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['DeleteImportingContactInput'] }
> = async (root, { input }, ctx) => {
  const parsedContact = JSON.parse(input?.importingField);
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);

  const lastSession = await strapi.entityService.findMany(
    'api::importing-session.importing-session',
    {
      filters: {
        type: input?.importingIdentifier,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  let deleteKey;

  switch (input?.keyType) {
    case 'completedImports':
      deleteKey = completedImportingData(
        lastSession?.[0]?.regexedId,
        tenantFilter?.tenant,
        input?.importingIdentifier,
      );
      break;
    case 'unvalidatedImports':
      deleteKey = spoiledImportingData(
        lastSession?.[0]?.regexedId,
        tenantFilter?.tenant,
        input?.importingIdentifier,
      );
      break;
    case 'needChangeCreations':
      deleteKey = updatingImportingData(
        lastSession?.[0]?.regexedId,
        tenantFilter?.tenant,
        input?.importingIdentifier,
      );
      break;
    default:
      handleLogger('error', 'deleteImportingContact', 'Type does not exist');
  }
  return input?.isAll
    ? await redis.ltrim(deleteKey, 1, 0)
    : await redis.lrem(deleteKey, 1, JSON.stringify(parsedContact));
};
