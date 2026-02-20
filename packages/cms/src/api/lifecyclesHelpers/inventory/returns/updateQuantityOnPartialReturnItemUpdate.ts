import { LifecycleHook } from '../../types';

export const updateQuantityOnPartialReturnItemUpdate: LifecycleHook = async ({
  params,
}) => {
  const { productOrderItem, quantityReturned } = params.data;
  const { id } = params.where;
  const ctx = strapi.requestContext.get();

  if (!productOrderItem || !quantityReturned) {
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

  const productInventoryItemService = strapi.service(
    'api::product-inventory-item.product-inventory-item',
  );

  const hasProductOrderItemChanged =
    returnItem.productOrderItem?.id !== productOrderItem;

  // If the product order item linked to a return item has changed, revert the return of the old product order item
  if (hasProductOrderItemChanged) {
    const productOrderItemEntity = await strapi.entityService.findOne(
      'api::product-order-item.product-order-item',
      returnItem.productOrderItem.id,
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
      await productInventoryItemService.processReturn({
        id: productOrderItemEntity?.product?.id,
        quantityReturned: returnItem.quantityReturned,
        revert: true,
      });
    }

    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'return',
          change: returnItem.quantityReturned.toString(),
          relationUuid: returnItem?.return?.uuid,
          productInventoryItem: productOrderItemEntity.product.id,
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
      await productInventoryEventService.removeRemainingInReceiveEvents({
        productItemId: productOrderItemEntity.product.id,
        transferQuantity: returnItem.quantityReturned,
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

  const productOrderItemEntity = await strapi.entityService.findOne(
    'api::product-order-item.product-order-item',
    productOrderItem,
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
    const returnDifference = hasProductOrderItemChanged
      ? quantityReturned
      : quantityReturned - returnItem.quantityReturned;

    await productInventoryItemService.processReturn({
      id: productOrderItemEntity.product.id,
      // If the product order item hasn't changed, subtract the old quantity returned from the new quantity returned so only the difference is updated
      quantityReturned: returnDifference,
    });

    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'return',
          change: returnDifference.toString(),
          relationUuid: returnItem?.return?.uuid,
          productInventoryItem: productOrderItemEntity.product.id,
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
      await productInventoryEventService.removeRemainingInReceiveEvents({
        productItemId: productOrderItemEntity.product.id,
        transferQuantity: returnDifference,
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
