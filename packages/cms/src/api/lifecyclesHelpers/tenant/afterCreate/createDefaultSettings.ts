import {
  companySettings,
  contactSettings,
  productSettings,
} from '../static/defaultSettings';

import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

export const createDefaultSettings = async (tenantId) => {
  handleLogger('info', 'Tenant createDefaultSettings', `Params: ${tenantId}`);

  try {
    /* contact settings */
    await strapi.entityService.create('api::contact-setting.contact-setting', {
      data: {
        ...contactSettings,
        tenant: tenantId,
      },
    });

    /* company settings */
    await strapi.entityService.create('api::company-setting.company-setting', {
      data: {
        ...companySettings,
        tenant: tenantId,
      },
    });

    /* product settings */
    await strapi.entityService.create('api::product-setting.product-setting', {
      data: {
        ...productSettings,
        tenant: tenantId,
      },
    });
  } catch (e) {
    handleError('createDefaultSettings', undefined, e);
  }
};
