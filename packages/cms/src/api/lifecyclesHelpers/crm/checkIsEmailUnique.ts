import { errors } from '@strapi/utils';
import { capitalize } from 'lodash';
import { fetchEntities } from './../../../api/lifecyclesHelpers/crm/utils/utils';
import {
  CrmEntityUid,
  LifecycleHook,
} from './../../../api/lifecyclesHelpers/types';
const { ApplicationError } = errors;

export const checkIsEmailUnique: LifecycleHook = async ({ params, model }) => {
  // Skip check is email unique during bulk imports for performance
  if (params?.data?._skipCheckIsEmailUnique) {
    delete params?.data?._skipCheckIsEmailUnique;
    return;
  }

  const entityId = params?.where?.id;
  const entityEmail = params?.data?.email?.toLowerCase();
  let tenant = params?.data?.tenant;
  const uid = model?.uid as CrmEntityUid | undefined;

  if (entityEmail) {
    if (!tenant && uid && entityId) {
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

      const filteredCustomers = (
        await fetchEntities(uid, tenantFilter, entityEmail)
      ).filter((customer) => customer?.id !== +entityId);

      if (filteredCustomers.length > 0) {
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
