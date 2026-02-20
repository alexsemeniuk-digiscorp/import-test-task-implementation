import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';

// When return type is partial, update the quantity of linked product order item
export const updateQuantityOnPartialReturnItemCreation: LifecycleHook = async ({
  params,
}) => {
  handleLogger(
    'info',
    'Lifecycle :: updateQuantityOnPartialReturnItemCreation',
    `Params ${JSON.stringify(params)}`,
  );

  const { productOrderItem, quantityReturned } = params.data;
  const ctx = strapi.requestContext.get();

  const sublocationItemService = strapi.service(
    'api::sublocation-item.sublocation-item',
  );

  if (!productOrderItem) {
    return;
  }

  const returnEntity = await strapi.entityService.findOne(
    'api::return.return',
    params.data.return,
    {
      fields: ['id', 'uuid'],
      populate: {
        sublocation: {
          fields: ['id'],
        },
      },
    },
  );

  const productOrderItemEntity = await strapi.entityService.findOne(
    'api::product-order-item.product-order-item',
    productOrderItem,
    {
      fields: ['id'],
      populate: {
        order: {
          fields: ['id', 'type', 'memo'],
        },
        product: {
          fields: ['id', 'quantity'],
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

    if (productOrderItemEntity.order?.type === 'purchase') {
      await strapi.entityService.create(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          data: {
            eventType: 'purchase return',
            change: quantityReturned.toString(),
            productInventoryItem: productOrderItemEntity.product?.id,
            relationUuid: returnEntity.uuid,
            addedBy: ctx.state.user?.id,
            businessLocation:
              productOrderItemEntity.product.businessLocation?.id,
            tenant: productOrderItemEntity.product.tenant?.id,
          },
        },
      );

      if (Number(productOrderItemEntity?.order?.memo) > 0) {
        const receiveEvents = await strapi.entityService.findMany(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            filters: {
              productInventoryItem: {
                id: { $eq: productOrderItemEntity.product.id },
              },
              order: {
                id: { $eq: productOrderItemEntity?.order?.id },
              },
              eventType: 'receive',
            },
            fields: ['id', 'remainingQuantity'],
          },
        );

        const receiveEvent = receiveEvents?.[0];

        const updatedQuantity =
          Number(receiveEvent?.remainingQuantity) - Number(quantityReturned);

        await strapi.entityService.update(
          'api::product-inventory-item-event.product-inventory-item-event',
          receiveEvent.id,
          {
            data: {
              remainingQuantity: updatedQuantity > 0 ? updatedQuantity : 0,
              isPartiallyReturned: updatedQuantity > 0,
              isFullyReturned: updatedQuantity <= 0,
            },
          },
        );
      } else {
        const productInventoryEventService = strapi.service(
          'api::product-inventory-item-event.product-inventory-item-event',
        );

        const { updatedReceiveEvents: removedReceiveEvents } =
          await productInventoryEventService.removeRemainingInReceiveEvents({
            productItemId: productOrderItemEntity.product.id,
            transferQuantity: quantityReturned,
          });

        await Promise.all(
          removedReceiveEvents.map(
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

      await productInventoryItemService.processReturn({
        id: productOrderItemEntity.product.id,
        quantityReturned,
        revert: true,
      });

      //returns with sublocations type purchase
      if (returnEntity?.sublocation && returnEntity?.sublocation?.id) {
        //if sublocation !== null ==>  decrement the qnt of sublocationItems (don't use exact sublocation which was used for receiving, because there could be a transfer between sublocations)

        const sublocationItem = await sublocationItemService.findMany({
          filters: {
            sublocation: { id: { $eq: returnEntity.sublocation.id } },
            productInventoryItem: {
              id: { $eq: productOrderItemEntity.product?.id },
            },
          },
          fields: ['id', 'quantity'],
        });

        if (sublocationItem.length) {
          //update SublocationItem QNTY
          if (Number(sublocationItem[0]?.quantity) - Number(quantityReturned)) {
            const updatedSublocationItem = await sublocationItemService.update(
              sublocationItem[0]?.id,
              {
                quantity:
                  Number(sublocationItem[0]?.quantity) -
                  Number(quantityReturned),
              },
            );

            if (!updatedSublocationItem)
              handleError(
                'Lifecycle :: updateQuantityOnPartialReturnItemCreation',
                `SublocationItem ${sublocationItem[0]?.id} was not updated after return`,
              );
          } else {
            const deletedSublocationItem = await sublocationItemService.delete(
              sublocationItem[0]?.id,
            );
            if (!deletedSublocationItem)
              handleError(
                'Lifecycle :: updateQuantityOnPartialReturnItemCreation',
                `Sublocation item ${sublocationItem[0]?.id} was not removed`,
              );
          }
        }
      }
    } else {
      //returns with sublocations
      if (returnEntity.sublocation?.id) {
        const sublocationItem = await sublocationItemService.findMany({
          filters: {
            sublocation: { id: { $eq: returnEntity.sublocation?.id } },
            productInventoryItem: {
              id: { $eq: productOrderItemEntity.product?.id },
            },
          },
          fields: ['id', 'quantity'],
        });

        if (
          !sublocationItem?.length &&
          Number(productOrderItemEntity.product.quantity) -
            Number(quantityReturned) >
            0
        ) {
          //create new SublocationItem
          const createdSublocationItem = await sublocationItemService.create({
            sublocation: returnEntity.sublocation?.id,
            productInventoryItem: productOrderItemEntity.product?.id,
            quantity: Number(quantityReturned),
            actualQty: 0,
            scannedQty: 0,
          });
          if (!createdSublocationItem)
            handleError(
              'Lifecycle :: updateQuantityOnPartialReturnItemCreation',
              `SublocationItem at sublocation ${returnEntity.sublocation?.id} not created. ProductInventory ${productOrderItem.product?.id}`,
            );
        }
        if (
          sublocationItem?.length &&
          Number(productOrderItemEntity.product.quantity) -
            Number(quantityReturned) >
            0
        ) {
          //update SublocationItem QNTY
          const updatedSublocationItem = await sublocationItemService.update(
            sublocationItem[0]?.id,
            {
              quantity:
                Number(sublocationItem[0]?.quantity) + Number(quantityReturned),
            },
          );
          if (!updatedSublocationItem)
            handleError(
              'Lifecycle :: updateQuantityOnPartialReturnItemCreation',
              `SublocationItem ${sublocationItem[0]?.id} was not updated after return`,
            );
        }
        if (
          sublocationItem?.length &&
          Number(productOrderItemEntity.product.quantity) -
            Number(quantityReturned) <
            0
        ) {
          //remove sublocationItems if product inventory qnt < 0
          await sublocationItemService.delete(sublocationItem[0]?.id);
        }
      }

      await strapi.entityService.create(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          data: {
            eventType: 'return',
            change: quantityReturned.toString(),
            productInventoryItem: productOrderItemEntity.product?.id,
            relationUuid: returnEntity.uuid,
            addedBy: ctx.state.user?.id,
            businessLocation:
              productOrderItemEntity.product.businessLocation?.id,
            tenant: productOrderItemEntity.product.tenant?.id,
          },
        },
      );

      const salesItemReportItems = await strapi.entityService.findMany(
        'api::sales-item-report.sales-item-report',
        {
          filters: {
            productOrderItem: productOrderItem,
          },
          fields: ['id'],
          sort: ['createdAt:desc'],
        },
      );

      const reportItemsToDelete = salesItemReportItems.slice(
        0,
        quantityReturned,
      );

      await Promise.all(
        reportItemsToDelete.map(async (reportItem) => {
          await strapi.entityService.delete(
            'api::sales-item-report.sales-item-report',
            reportItem.id,
          );
        }),
      );
    }
  }
};
