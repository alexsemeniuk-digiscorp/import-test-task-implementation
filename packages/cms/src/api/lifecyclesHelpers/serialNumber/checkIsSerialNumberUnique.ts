import { errors } from '@strapi/utils';
import { capitalize } from 'lodash';
import { LifecycleHook } from './../../../api/lifecyclesHelpers/types';
const { ApplicationError } = errors;

export const checkIsSerialNumberUnique: LifecycleHook = async ({ params }) => {
  const entityId = params?.where?.id;
  const entityField = params?.data?.name;
  let tenant = params?.data?.tenant;
  const uid = 'api::inventory-serialize.inventory-serialize';

  if (entityField) {
    if (!tenant && uid && entityId) {
      const findTenant = await strapi.entityService.findOne(uid, entityId, {
        fields: ['id'],
        populate: {
          tenant: {
            fields: ['id'],
          },
        },
      });
      tenant = findTenant?.tenant?.id;
    }

    if (tenant) {
      const tenantFilter = { tenant: { id: { $eq: tenant } } };

      const filteredSerialNumbers = (
        await strapi.entityService.findMany(uid, {
          filters: {
            name: entityField,
            ...tenantFilter,
          },
          fields: ['id'],
        })
      ).filter((number) => number?.id !== +entityId);

      if (filteredSerialNumbers.length > 0) {
        const entityType = uid.split('::')[1].split('.')[0];
        throw new ApplicationError(
          `Custom: ${capitalize(
            entityType,
          )} with the same email already exists`,
        );
      }
    } else {
      throw new Error('No related tenantId found');
    }
  }
};
