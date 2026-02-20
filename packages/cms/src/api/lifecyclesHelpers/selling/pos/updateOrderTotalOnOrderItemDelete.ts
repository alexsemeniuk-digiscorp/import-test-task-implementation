import { handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateOrderTotalOnOrderItemDelete = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeDeleteOrderItemLifeCycleHook updateOrderTotalOnOrderItemDelete',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const apiName = event.model.uid;

  const ctx = strapi.requestContext.get();
  const currentItemQuantity = currentItemData?.quantity ?? 0;

  if (
    currentItemData.status !== 'draft' &&
    currentItemData.order.type !== 'purchase' &&
    currentItemData.order.type !== 'estimate'
  ) {
    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    if (apiName === 'api::product-order-item.product-order-item') {
      const productItem = await strapi.entityService.findMany(
        'api::product-inventory-item.product-inventory-item',
        {
          filters: {
            uuid: {
              $eq: currentItemData.itemId,
            },
            businessLocation: {
              id: {
                $eq: currentItemData.order.businessLocation.id,
              },
            },
          },
          fields: ['id', 'quantity'],
        },
      );

      const foundProductItemQuantity = productItem?.[0]?.quantity ?? 0;

      const newQuantity =
        currentItemData.order.type === 'tradeIn'
          ? foundProductItemQuantity - currentItemQuantity
          : foundProductItemQuantity + currentItemQuantity;

      if (productItem?.[0]?.id) {
        await strapi.entityService.update(
          'api::product-inventory-item.product-inventory-item',
          productItem[0].id,
          {
            data: {
              quantity: newQuantity,
            },
          },
        );
      }

      if (currentItemData.order.type !== 'tradeIn' && productItem?.[0]?.id) {
        const { updatedReceiveEvents } =
          await productInventoryEventService.addRemainingInReceiveEvents({
            productItemId: productItem[0].id,
            transferQuantity: currentItemQuantity,
          });

        await strapi.entityService.create(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            data: {
              eventType: 'pos order item remove',
              change: currentItemQuantity.toString(),
              productInventoryItem: productItem[0].id,
              addedBy: ctx.state.user.id,
              businessLocation: currentItemData.order.businessLocation.id,
              tenant: currentItemData.order.tenant.id,
              itemContactVendor:
                currentItemData?.order?.contact?.id ?? undefined,
              itemVendor: currentItemData?.order?.company?.id ?? undefined,
            },
          },
        );

        await Promise.all(
          updatedReceiveEvents.map(
            async (receiveEvent) =>
              await strapi.entityService.update(
                'api::product-inventory-item-event.product-inventory-item-event',
                receiveEvent.id,
                {
                  data: {
                    remainingQuantity: receiveEvent.remainingQuantity,
                  },
                },
              ),
          ),
        );
      } else {
        if (apiName === 'api::product-order-item.product-order-item') {
          const currentProductInventoryItemEvent =
            await strapi.entityService.findMany(
              'api::product-inventory-item-event.product-inventory-item-event',
              {
                filters: {
                  productInventoryItem: {
                    id: { $eq: productItem[0]?.id },
                  },
                  order: {
                    id: {
                      $eq: currentItemData?.order?.id,
                    },
                  },
                  eventType: 'receive',
                },
                fields: ['id'],
              },
            );

          if (currentProductInventoryItemEvent?.length > 0) {
            await strapi.entityService.delete(
              'api::product-inventory-item-event.product-inventory-item-event',
              currentProductInventoryItemEvent[0]?.id,
            );
          }
        }
      }
    }
  }
};
