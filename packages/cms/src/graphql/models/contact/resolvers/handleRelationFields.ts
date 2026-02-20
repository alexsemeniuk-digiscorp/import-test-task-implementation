import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { handleError } from './../../../../../src/graphql/helpers/errors';
import { NexusGenInputs } from './../../../../../src/types/generated/graphql';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

export const handleRelationFields: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['HandleRelationFieldsInput'] }
> = async (root, { input }, ctx) => {
  const tenantFilter = await getTenantFilter(ctx.state.user.id);

  try {
    const { newDataArray, deletedArray, namesChangedArray } = input;

    if (namesChangedArray && namesChangedArray.length > 0) {
      for (let i = 0; i < namesChangedArray.length; i++) {
        await strapi.entityService.update(
          'api::crm-relation.crm-relation',
          namesChangedArray?.[i]?.id as ID,
          {
            data: {
              toContact: namesChangedArray[i]?.toContact as ID,
              relationType: namesChangedArray[i]?.relationType as ID,
            },
          },
        );
      }
    }

    if (newDataArray && newDataArray.length > 0) {
      for (let i = 0; i < newDataArray.length; i++) {
        await strapi.entityService.create('api::crm-relation.crm-relation', {
          data: {
            fromContact: input.entityId as ID,
            toContact: newDataArray?.[i]?.toContact as ID,
            relationType: newDataArray[i]?.relationType as ID,
            tenant: tenantFilter.tenant,
          },
        });
      }
    }

    if (deletedArray && deletedArray.length > 0) {
      for (let i = 0; i < deletedArray.length; i++) {
        if (deletedArray?.[i]?.id) {
          await strapi.entityService.delete(
            'api::crm-relation.crm-relation',
            deletedArray[i].id as ID,
          );
        }
      }
    }
  } catch (e) {
    handleError('handleRelationFields', undefined, e);
  }
};
