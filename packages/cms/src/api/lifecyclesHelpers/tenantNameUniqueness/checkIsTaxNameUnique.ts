import { CrmEntityUid, LifecycleHook } from '../types';

import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

export const checkIsTaxNameUnique: LifecycleHook = async ({
  params,
  model,
}) => {
  const entityId = params?.where?.id;
  const entityName = params?.data?.name;
  let tenant = params?.data?.tenant;
  const uid = model?.uid as CrmEntityUid | undefined;

  if (entityName) {
    if (!tenant && uid) {
      const findTenant = await strapi.entityService.findOne(
        uid as CrmEntityUid,
        entityId,
        {
          fields: ['id'],
          populate: {
            tenant: {
              fields: ['id'],
            },
          },
        },
      );
      tenant = findTenant?.tenant?.id;
    }

    if (tenant) {
      const tenantFilter = { tenant: { id: { $eq: tenant } } };
      const existingTaxes = await strapi.entityService.findMany(
        'api::tax.tax',
        {
          filters: {
            ...tenantFilter,
            name: { $eq: entityName },
          },
          fields: ['id'],
        },
      );
      const filteredTaxes = existingTaxes?.filter(
        (tax) => tax?.id !== +entityId,
      );

      if (filteredTaxes?.length > 0) {
        throw new ApplicationError(
          `Custom: ${entityName} with the same name already exists`,
        );
      }
    } else {
      throw new Error('No related tenantId found');
    }
  }
};
