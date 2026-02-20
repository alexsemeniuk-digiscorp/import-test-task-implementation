import { handleLogger } from '../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateHistoryEventOnReceivedPurchaseOrderChange = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'PRODUCT ORDER ITEM beforeUpdate updateHistoryEventOnReceivedPurchaseOrderChange',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const { data } = event.params;
  const entityPrice = data?.price;

  const isPurchaseReceived =
    currentItemData?.order?.type === 'purchase' &&
    currentItemData?.order?.status === 'received';
  const isPurchaseShipped =
    currentItemData?.order?.type === 'purchase' &&
    currentItemData?.order?.status === 'shipped';

  if (
    !(isPurchaseReceived || isPurchaseShipped) ||
    entityPrice === currentItemData?.price
  ) {
    return;
  }

  const currentProductInventoryItemEvent = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        productInventoryItem: {
          id: { $eq: currentItemData?.product?.id },
        },
        order: {
          id: {
            $eq: currentItemData?.order?.id,
          },
        },
        eventType: 'receive',
      },
      fields: ['id', 'itemCost'],
    },
  );

  if (
    !currentProductInventoryItemEvent ||
    (currentProductInventoryItemEvent &&
      currentProductInventoryItemEvent?.length === 0)
  )
    return;

  const eventItemCost = currentProductInventoryItemEvent?.[0]?.itemCost;

  if (entityPrice !== eventItemCost) {
    await strapi.entityService.update(
      'api::product-inventory-item-event.product-inventory-item-event',
      currentProductInventoryItemEvent?.[0]?.id,
      {
        data: {
          itemCost: entityPrice,
        },
      },
    );
  }
};
