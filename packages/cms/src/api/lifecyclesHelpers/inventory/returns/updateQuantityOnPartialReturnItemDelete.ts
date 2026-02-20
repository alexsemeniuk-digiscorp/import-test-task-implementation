import { LifecycleHook } from '../../types';

// Revert the return of the deleted return item
export const updateQuantityOnPartialReturnItemDelete: LifecycleHook = async ({
  params,
}) => {
  const { id } = params.where;
  const ctx = strapi.requestContext.get();

  if (!id) {
    return;
  }

  const returnItem = await strapi.entityService.findOne(
    'api::return-item.return-item',
    id,
    {
      fields: ['id', 'quantityReturned'],
      populate: {
        productOrderItem: {
          fields: ['id'],
        },
        return: {
          fields: ['id', 'uuid'],
        },
      },
    },
  );

  if (!returnItem) {
    return;
  }

  const { productOrderItem, quantityReturned } = returnItem;

  const productOrderItemEntity = await strapi.entityService.findOne(
    'api::product-order-item.product-order-item',
    productOrderItem?.id,
    {
      fields: ['id'],
      populate: {
        product: {
          fields: ['id'],
          populate: {
            businessLocation: {
              fields: ['id'],
            },
            tenant: {
              fields: ['id'],
            },
          },
        },
      },
    },
  );

  if (productOrderItemEntity) {
    const productInventoryItemService = strapi.service(
      'api::product-inventory-item.product-inventory-item',
    );

    await productInventoryItemService.processReturn({
      id: productOrderItemEntity.product.id,
      quantityReturned,
    });

    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'canceled return',
          change: quantityReturned.toString(),
          productInventoryItem: productOrderItemEntity.product.id,
          relationUuid: returnItem?.return?.uuid,
          addedBy: ctx.state.user.id,
          businessLocation: productOrderItemEntity.product.businessLocation.id,
          tenant: productOrderItemEntity.product.tenant.id,
        },
      },
    );

    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    const { updatedReceiveEvents } =
      await productInventoryEventService.processCancelReturnEvents({
        productItemId: productOrderItemEntity.product.id,
        transferQuantity: quantityReturned,
      });

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
  }
};
