import { errors } from '@strapi/utils';
import { LifecycleHook } from './../../../../api/lifecyclesHelpers/types';
const { ApplicationError } = errors;

export const checkIsTaxesNameUnique: LifecycleHook = async ({ params }) => {
  const entityId = params?.where?.id;
  const entityName = params?.data?.name;
  let tenant = params?.data?.tenant;

  if (entityName) {
    if (!tenant) {
      const findTenant = await strapi.entityService.findOne(
        'api::tax.tax',
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
          filters: { name: { $eq: entityName }, ...tenantFilter },
          fields: ['id', 'name'],
          limit: 1,
        },
      );

      const filteredTaxes = existingTaxes.filter(
        (customer) => customer?.id !== +entityId,
      );
      if (filteredTaxes.length > 0) {
        throw new ApplicationError(
          `Custom: Taxes with the same email or phone number already exists`,
        );
      }
    } else {
      throw new Error('No related tenantId found');
    }
  }
};
