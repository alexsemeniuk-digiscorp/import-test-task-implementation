import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;
import { handleLogger } from '../../../../graphql/helpers/errors';

export const addDefaultPurchaseTax = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'OrderItem addDefaultPurchaseTax',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const tenantId = currentOrder?.tenant?.id;

  if (!tenantId) return;

  const productSettingsData = await strapi.entityService.findMany(
    'api::product-setting.product-setting',
    {
      filters: {
        tenant: {
          id: tenantId,
        },
      },
      fields: ['id'],
      populate: {
        defaultPurchaseTax: {
          fields: ['id'],
        },
      },
    },
  );

  const productSettings = productSettingsData?.[0];

  if (!productSettings) return;

  const defaultPurchaseTax = productSettings?.defaultPurchaseTax?.id;

  if (!defaultPurchaseTax) return;

  event.params.data.tax = defaultPurchaseTax;
};
