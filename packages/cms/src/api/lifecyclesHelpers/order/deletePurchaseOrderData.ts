import { handleLogger } from '../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deletePurchaseOrderData = async (
  { params }: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook deletePurchaseOrderData',
    `Params :: ${JSON.stringify(params)}`,
  );

  if (currentOrder?.type === 'purchase') {
    const dealTransactions = await strapi.entityService.findMany(
      'api::deal-transaction.deal-transaction',
      {
        filters: {
          sellingOrder: currentOrder?.id,
        },
        fields: ['id'],
      },
    );

    const receiveEvents = await strapi.entityService.findMany(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        filters: {
          order: currentOrder?.id,
        },
        fields: ['id', 'remainingQuantity', 'change'],
        populate: {
          productInventoryItem: {
            fields: ['id', 'quantity'],
          },
        },
      },
    );

    if (dealTransactions.length > 0) {
      await Promise.all(
        dealTransactions.map(async (dealTransaction) => {
          await strapi.entityService.delete(
            'api::deal-transaction.deal-transaction',
            dealTransaction.id,
          );
        }),
      );
    }

    if (receiveEvents.length > 0) {
      await Promise.all(
        receiveEvents.map(async (event) => {
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            event?.productInventoryItem?.id,
            {
              data: {
                quantity:
                  event?.productInventoryItem?.quantity - Number(event?.change),
              },
            },
          );

          await strapi.entityService.delete(
            'api::product-inventory-item-event.product-inventory-item-event',
            event.id,
          );
        }),
      );
    }
  }
};
