import { Common } from '@strapi/strapi';

import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';

type ChangeType = 'update' | 'delete';

type ChangeArgs = {
  id: number;
};

const getUidFromFieldName = (changeType: ChangeType, fieldName: string) => {
  const entityName = fieldName.replace(changeType, '');

  const entityNameInKebabCase = _.kebabCase(entityName);

  return `api::${entityNameInKebabCase}.${entityNameInKebabCase}` as Common.UID.ContentType;
};

export const checkIfEntityCanBeChangedByTenant = async (
  changeType: ChangeType,
  args: ChangeArgs,
  info: GraphQLResolveInfo,
  ctx: Graphql.ResolverContext,
) => {
  const uid = getUidFromFieldName(changeType, info.fieldName);

  const entityName = info.fieldName.replace(changeType, '');

  const entity = await strapi.entityService
    .findOne(uid, args.id, {
      populate: {
        tenant: true,
      } as any,
    })
    .then((result) => result as unknown as { tenant?: { id?: number } });

  if (!entity) {
    throw new Error(`${entityName} not found`);
  }
  if (entity.tenant?.id !== ctx.state.user?.tenantId) {
    throw new Error(`You are not allowed to change this ${entityName}`);
  }
};

export const checkIfEntityCanBeChangedByUser = async (
  changeType: ChangeType,
  args: ChangeArgs,
  info: GraphQLResolveInfo,
  ctx: Graphql.ResolverContext,
) => {
  const uid = getUidFromFieldName(changeType, info.fieldName);

  const entityName = info.fieldName.replace(changeType, '');

  const entity = await strapi.entityService
    .findOne(uid, args.id, {
      populate: {
        user: true,
      } as any,
    })
    .then((result) => result as unknown as { user?: { id?: number } });

  if (!entity) {
    throw new Error(`${entityName} not found`);
  }

  if (entity.user?.id !== ctx.state.user?.id) {
    throw new Error(`You are not allowed to change this ${entityName}`);
  }
};
