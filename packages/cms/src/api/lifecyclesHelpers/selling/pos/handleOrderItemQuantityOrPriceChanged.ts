import { errors } from '@strapi/utils';
import { handleError } from '../../../../graphql/helpers/errors';
import { createOrderByEcommerceRoutes } from '../../crm/utils/utils';

const { ApplicationError } = errors;

export const handleOrderItemQuantityOrPriceChanged = async ({
  entityQuantity,
  currentItemData,
  excludeOrderType,
  apiName,
  userId,
  entityPrice,
  originalUrl,
}) => {
  const quantityDiffResult =
    Number(entityQuantity) - Number(currentItemData.quantity);

  if (
    currentItemData.status !== 'draft' &&
    excludeOrderType &&
    apiName === 'api::product-order-item.product-order-item'
  ) {
    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    const productItem = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters: {
          product: {
            uuid: { $eq: currentItemData?.product?.product?.uuid },
          },
          businessLocation: {
            id: {
              $eq: currentItemData?.order?.return
                ? currentItemData.order.return?.businessLocation?.id
                : currentItemData.order?.businessLocation?.id,
            },
          },
        },
        fields: ['id', 'quantity', 'isNegativeCount'],
      },
    );

    if (currentItemData.order.type !== 'tradeIn') {
      if (productItem[0]?.quantity - quantityDiffResult < 0) {
        if (productItem[0]?.isNegativeCount) {
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            productItem[0]?.id,
            {
              data: {
                quantity: productItem[0].quantity - quantityDiffResult,
              },
            },
          );
        } else {
          handleError(
            'beforeUpdateOrderItemLifeCycleHook updateOrderTotalOnOrderItemUpdate',
            'This amount of product is currently unavailable',
            new ApplicationError(
              'Custom: This amount of product is currently unavailable',
            ),
          );
        }
      }

      if (productItem[0]?.quantity - quantityDiffResult >= 0) {
        await strapi.entityService.update(
          'api::product-inventory-item.product-inventory-item',
          productItem[0].id,
          {
            data: {
              quantity: productItem[0]?.quantity - quantityDiffResult,
            },
          },
        );
      }

      if (quantityDiffResult > 0) {
        const { updatedReceiveEvents } =
          await productInventoryEventService.removeRemainingInReceiveEvents({
            productItemId: productItem[0]?.id,
            transferQuantity: quantityDiffResult,
          });

        let ownerId = userId;

        if (createOrderByEcommerceRoutes.includes(originalUrl)) {
          ownerId = await strapi
            .query('plugin::users-permissions.user')
            .findOne({
              where: {
                tenant: currentItemData?.order?.tenant?.id,
                role: { name: 'Owner' },
              },
            });
        }

        await strapi.entityService.create(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            data: {
              eventType: 'pos order item add',
              change: quantityDiffResult.toString(),
              productInventoryItem: productItem[0].id,
              addedBy: ownerId,
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
        const { updatedReceiveEvents } =
          await productInventoryEventService.addRemainingInReceiveEvents({
            productItemId: productItem[0]?.id,
            transferQuantity: Math.abs(quantityDiffResult),
          });

        await strapi.entityService.create(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            data: {
              eventType: 'pos order item remove',
              change: Math.abs(quantityDiffResult).toString(),
              productInventoryItem: productItem[0]?.id,
              addedBy: userId,
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
      }
    } else {
      if (entityQuantity === 0) return;

      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productItem[0]?.id,
        {
          data: {
            quantity: productItem[0]?.quantity + quantityDiffResult,
          },
        },
      );

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
            fields: ['id', 'change', 'remainingQuantity', 'itemCost'],
          },
        );

      if (currentProductInventoryItemEvent?.length > 0) {
        await strapi.entityService.update(
          'api::product-inventory-item-event.product-inventory-item-event',
          currentProductInventoryItemEvent[0]?.id,
          {
            data: {
              change:
                entityQuantity?.toString() ??
                currentProductInventoryItemEvent[0]?.change,
              remainingQuantity:
                entityQuantity ??
                currentProductInventoryItemEvent[0]?.remainingQuantity,
              itemCost:
                entityPrice ?? currentProductInventoryItemEvent[0]?.itemCost,
              itemVendor: currentItemData?.order?.company?.id ?? null,
              itemContactVendor: currentItemData?.order?.contact?.id ?? null,
            },
          },
        );
      }
    }
  }
};
