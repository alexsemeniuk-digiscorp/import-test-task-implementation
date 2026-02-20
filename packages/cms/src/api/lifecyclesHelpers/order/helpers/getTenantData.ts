import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export const getTenantData = async (tenantId: ID) => {
  return await strapi.entityService.findOne('api::tenant.tenant', tenantId, {
    populate: ['logo', 'mainLocation'],
  });
};
