import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';

const isEmpty = (value: unknown) => value === undefined || value === null;

export const processProductInventoryItemQuantityUpdate: LifecycleHook = async ({
  params,
}) => {
  handleLogger(
    'info',
    'ProductInventoryItem beforeUpdateLifeCycleHook processProductInventoryItemQuantityUpdate',
    `Params: ${JSON.stringify(params)}`,
  );

  const { quantity, lowQuantity } = params.data;
  const { id } = params.where;

  if (isEmpty(quantity) && isEmpty(lowQuantity)) {
    return;
  }

  const productInventoryItem = await strapi.entityService.findOne(
    'api::product-inventory-item.product-inventory-item',
    id,
    {
      fields: ['id', 'quantity', 'lowQuantity'],
      populate: {
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const {
    quantity: currentQuantity,
    lowQuantity: currentLowQuantity,
    tenant,
  } = productInventoryItem;

  const actualQuantity = isEmpty(quantity) ? currentQuantity : quantity;
  const actualLowQuantity = isEmpty(lowQuantity)
    ? currentLowQuantity
    : lowQuantity;

  const inventoryQuantityNotificationService = strapi.service(
    'api::inventory-quantity-notification.inventory-quantity-notification',
  );

  if (actualLowQuantity !== null && actualQuantity <= actualLowQuantity) {
    await inventoryQuantityNotificationService.createInventoryQuantityNotification(
      id,
      actualQuantity,
      tenant?.id,
    );
  }
};
