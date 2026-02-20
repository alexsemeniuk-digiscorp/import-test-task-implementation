/**
 * return service
 */

import { factories } from '@strapi/strapi';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';

export default factories.createCoreService('api::return.return', () => ({
  async processFullReturn({
    orderId,
    revert, // Revert is used to revert the return, e.g. when the return is deleted or the return type is changed to partial
    uuid,
    sublocation: sublocationId,
  }: {
    orderId: number;
    uuid?: string;
    revert?: boolean;
    sublocation?: string;
  }) {
    const ctx = strapi.requestContext.get();
    handleLogger(
      'info',
      'Service :: processFullReturn',
      `Params: {orderId: ${orderId} }, revert: ${revert}, uuid: ${uuid} sublocation: ${sublocationId}`,
    );

    const sublocationItemService = strapi.service(
      'api::sublocation-item.sublocation-item',
    );

    const orderEntity = await strapi.entityService.findOne(
      'api::order.order',
      orderId,
      {
        populate: {
          products: {
            populate: ['product', 'product.tenant', 'product.businessLocation'],
          },
        },
      },
    );

    if (!orderEntity)
      return handleError(
        'Service :: processFullReturn',
        ``,
        new Error(`Order ${orderId} not found`),
      );
    if (!orderEntity?.products?.length) {
      return handleError(
        'Service :: processFullReturn',
        `Order ${orderId} products not found.`,
      );
    }

    const buyItems = orderEntity.products.filter(
      (item) => item.purchaseType === 'buy',
    ); // TODO (Illia): move to filters after strapi update, right now populate doesn't work properly with filters

    const productInventoryItemService = strapi.service(
      'api::product-inventory-item.product-inventory-item',
    );

    await Promise.all(
      buyItems.map(async (productOrderItem) => {
        const productInventoryEventService = strapi.service(
          'api::product-inventory-item-event.product-inventory-item-event',
        );

        if (orderEntity?.type === 'purchase') {
          const { updatedReceiveEvents: removedReceiveEvents } =
            await productInventoryEventService.removeRemainingInReceiveEvents({
              productItemId: productOrderItem.product?.id,
              transferQuantity: productOrderItem.quantity,
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

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                eventType: 'purchase return',
                change: productOrderItem.quantity.toString(),
                productInventoryItem: productOrderItem.product?.id,
                relationUuid: uuid,
                addedBy: ctx.state.user.id,
                businessLocation: productOrderItem.product.businessLocation.id,
                tenant: productOrderItem.product.tenant.id,
              },
            },
          );

          //if sublocation !== null ==>  decrement the qnt of sublocationItems (don't use exact sublocation which was used for receiving, because there could be a transfer between sublocations)

          if (sublocationId) {
            const sublocationItem = await sublocationItemService.findMany({
              filters: {
                sublocation: { id: { $eq: sublocationId } },
                productInventoryItem: {
                  id: { $eq: productOrderItem.product?.id },
                },
              },
            });

            if (sublocationItem.length) {
              //update SublocationItem QNTY
              if (
                Number(sublocationItem[0].quantity) -
                  Number(productOrderItem.quantity) &&
                productOrderItem.product?.quantity
              ) {
                const updatedSublocationItem =
                  await sublocationItemService.update(sublocationItem[0]?.id, {
                    quantity:
                      Number(sublocationItem[0].quantity) -
                      Number(productOrderItem.quantity),
                  });
                if (!updatedSublocationItem)
                  handleError(
                    'Service :: processFullReturn',
                    `SublocationItem ${sublocationItem[0]?.id} was not updated after return`,
                  );
              } else {
                const deletedSublocationItem =
                  await sublocationItemService.delete(sublocationItem[0]?.id);
                if (!deletedSublocationItem)
                  handleError(
                    'Service :: processFullReturn',
                    `Sublocation item ${sublocationItem[0]?.id} was not removed`,
                  );
              }
            }
          }
        } else {
          if (sublocationId) {
            //add to sublocation qnty: upd or create sublocation Item

            //Check if a sublocationItem exists for a given ProductInventoryItem ID and sublocation
            const sublocationItem = await sublocationItemService.findMany({
              filters: {
                sublocation: { id: { $eq: sublocationId } },
                productInventoryItem: {
                  id: { $eq: productOrderItem.product?.id },
                },
              },
            });

            if (
              !sublocationItem?.length &&
              Number(productOrderItem.product?.quantity) >= 0
            ) {
              //create new SublocationItem
              const createdSublocationItem =
                await sublocationItemService.create({
                  sublocation: sublocationId,
                  productInventoryItem: productOrderItem.product?.id,
                  quantity: productOrderItem.quantity,
                  actualQty: 0,
                  scannedQty: 0,
                });
              if (!createdSublocationItem)
                handleError(
                  'Service :: processFullReturn',
                  `SublocationItem at sublocation ${sublocationId} not created. ProductInventory ${productOrderItem.product?.id}`,
                );
            }
            if (
              sublocationItem?.length &&
              Number(productOrderItem.product?.quantity) > 0
            ) {
              //update SublocationItem QNTY
              const updatedSublocationItem =
                await sublocationItemService.update(sublocationItem[0]?.id, {
                  quantity:
                    Number(sublocationItem[0].quantity) +
                    Number(productOrderItem.quantity),
                });
              if (!updatedSublocationItem)
                handleError(
                  'Service :: processFullReturn',
                  `SublocationItem ${sublocationItem[0]?.id} was not updated after return`,
                );
            }
            if (
              sublocationItem?.length &&
              Number(productOrderItem.product?.quantity) < 0
            ) {
              await sublocationItemService.delete(sublocationItem[0]?.id);
            }
          }

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                eventType: 'return',
                change: productOrderItem.quantity.toString(),
                productInventoryItem: productOrderItem.product?.id,
                relationUuid: uuid,
                addedBy: ctx.state.user.id,
                businessLocation: productOrderItem.product.businessLocation.id,
                tenant: productOrderItem.product.tenant.id,
              },
            },
          );
        }

        if (orderEntity?.type === 'purchase') {
          return productInventoryItemService.processReturn({
            id: productOrderItem.product?.id,
            quantityReturned: productOrderItem.quantity,
            revert: true,
          });
        }
      }),
    );
  },
}));
