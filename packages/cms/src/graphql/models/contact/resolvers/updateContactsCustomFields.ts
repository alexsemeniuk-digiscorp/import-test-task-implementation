import { GraphQLFieldResolver } from 'graphql';

import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

import { NexusGenInputs } from './../../../../types/generated/graphql';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';
export const updateContactsCustomFields: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CrmCustomFieldsInput'] }
> = async (root, { input }, ctx) => {
  const tenantFilter = await getTenantFilter(ctx.state.user.id);
  const { newDataArray, deletedArray, namesChangedArray } = input;

  if (namesChangedArray && namesChangedArray.length > 0) {
    for (let i = 0; i < namesChangedArray.length; i++) {
      await strapi.entityService.update(
        'api::crm-custom-field-name.crm-custom-field-name',
        namesChangedArray?.[i]?.id as ID,
        {
          data: {
            name: namesChangedArray?.[i]?.name ?? '',
          },
        },
      );
    }
  }

  if (newDataArray && newDataArray.length > 0) {
    for (let i = 0; i < newDataArray.length; i++) {
      await strapi.entityService.create(
        'api::crm-custom-field-name.crm-custom-field-name',
        {
          data: {
            name: newDataArray?.[i]?.name ?? '',
            tenant: tenantFilter.tenant,
            crmType: input.crmType,
          },
        },
      );
    }
  }

  if (deletedArray && deletedArray.length > 0) {
    for (let i = 0; i < deletedArray.length; i++) {
      if (deletedArray?.[i]?.id) {
        await strapi.entityService.delete(
          'api::crm-custom-field-name.crm-custom-field-name',
          deletedArray[i].id as ID,
        );
      }
    }
  }
};
