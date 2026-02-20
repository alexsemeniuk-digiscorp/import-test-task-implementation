import { generateId } from './../../../../src/utils/randomBytes';
import { LifecycleHook } from './../types';
import { InventoryEntityUid } from './checkIsNameOrBarcodeUnique';

export const appendUniqueRegexedIdForInventory: LifecycleHook = async ({
  params,
  model,
}) => {
  // Skip ID generation during bulk imports for performance
  if (params?.data?._skipProductIdCheck) {
    delete params?.data?._skipProductIdCheck;
    return;
  }

  let regexedKeyName;

  const tenant = params?.data?.tenant;
  const tenantFilter = tenant ? { tenant: { id: { $eq: tenant } } } : {};

  switch (model.uid) {
    case 'api::product.product':
      regexedKeyName = 'productId';
      break;
    case 'api::service.service':
      regexedKeyName = 'serviceId';
      break;
    case 'api::membership.membership':
      regexedKeyName = 'membershipId';
      break;
    case 'api::class.class':
      regexedKeyName = 'classId';
      break;
    default:
      regexedKeyName = 'regexedId';
  }

  let newRegexedId = params.data[regexedKeyName] || generateId();

  const isIdUnique = async (id: string) => {
    const existingEntities = await strapi.entityService.findMany(
      model.uid as InventoryEntityUid,
      {
        filters: {
          ...tenantFilter,
          [regexedKeyName]: id,
        },
        fields: ['id'],
        limit: 1,
      },
    );

    return existingEntities.length === 0;
  };

  while (!(await isIdUnique(newRegexedId))) {
    newRegexedId = generateId();
  }

  params.data[regexedKeyName] = newRegexedId;
};
