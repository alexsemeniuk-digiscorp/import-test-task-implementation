import { CrmEntityUid } from '../../../../api/lifecyclesHelpers/types';
import { DEFAULT_EMAIL } from './../../../../../src/graphql/constants/defaultValues';

export const standardizePhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/[^+\d]/g, '');
};

export const fetchEntities = async (
  uid: CrmEntityUid,
  tenantFilter: any,
  entityEmail?: string,
) => {
  const filters = {
    ...tenantFilter,

    email: {
      $eq: entityEmail,
      $ne: DEFAULT_EMAIL,
    },
  };

  if (uid === 'api::contact.contact' || uid === 'api::company.company') {
    const [existingContacts, existingCompanies] = await Promise.all([
      strapi.entityService.findMany('api::contact.contact', {
        filters,
        fields: ['id', 'email', 'phoneNumber'],
      }),
      strapi.entityService.findMany('api::company.company', {
        filters,
        fields: ['id', 'email', 'phoneNumber'],
      }),
    ]);
    return [...existingContacts, ...existingCompanies];
  } else if (uid === 'api::lead.lead') {
    return await strapi.entityService.findMany('api::lead.lead', {
      filters,
      fields: ['id', 'email', 'phoneNumber'],
    });
  }

  return [];
};

export const createOrderByEcommerceRoutes = [
  '/api/create-order',
  '/api/create-shop-order',
  '/api/create-woo-order',
  '/api/create-magento-order',
];
