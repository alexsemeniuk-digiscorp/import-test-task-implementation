import { LifecycleHook } from '../types';

export const createDefaultSubLocation: LifecycleHook = async ({
  result,
  params,
}) => {
  const businessLocationId = result.id;
  const tenantId = params.data.tenant;
  await strapi.entityService.create('api::sublocation.sublocation', {
    data: {
      name: 'Default Sublocation',
      businessLocation: businessLocationId,
      tenant: tenantId,
    },
  });
};
