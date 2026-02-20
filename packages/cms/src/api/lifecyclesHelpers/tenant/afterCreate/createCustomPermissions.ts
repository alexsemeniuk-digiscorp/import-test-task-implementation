import { handleError } from '../../../../graphql/helpers/errors';
import * as defaultText from '../static/defaultTexts';
import { customPermissions } from '../static/permissions';

export const createCustomPermissions = async (tenantId) => {
  try {
    await strapi.entityService.create(
      'api::custom-permission.custom-permission',
      {
        data: {
          permissions: JSON.parse(JSON.stringify(customPermissions)),
          tenant: tenantId,
        },
      },
    );

    await strapi.entityService.create(
      'api::document-permission.document-permission',
      {
        data: {
          invoiceTerms: defaultText.invoiceAndPurchaseTerms,
          purchaseTerms: defaultText.invoiceAndPurchaseTerms,
          appraisalTerms: defaultText.appraisalTerms,
          invoiceClientMessage: defaultText.invoiceClientMessage,
          taskNotificationContent: defaultText.taskDefaultContent,
          tenant: tenantId,
        },
      },
    );
  } catch (e) {
    handleError('createCustomPermissions', undefined, e);
  }
};
