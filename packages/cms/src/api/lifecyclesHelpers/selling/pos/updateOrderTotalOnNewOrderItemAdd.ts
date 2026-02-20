import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { createOrderByEcommerceRoutes } from '../../crm/utils/utils';
import { OrderItemEntityApiType, OrderItemEntityType } from '../../types';

export const updateOrderTotalOnNewOrderItemAdd =
  (entityName: OrderItemEntityType) =>
  async ({ params, result, model }, currentOrder, currentItemData) => {
    handleLogger(
      'info',
      'ProductOrderItem afterCreateOrderItemLifeCycleHook updateOrderTotalOnNewOrderItemAdd',
      `Params :: ${JSON.stringify(params)}`,
    );

    const orderId = params?.data?.order;
    const apiName = model.uid as OrderItemEntityApiType;
    const { id, quantity, isCompositeProductItem, price } = result;

    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    const ctx = strapi.requestContext.get();

    const orderStatusCondition = currentItemData?.status !== 'draft';
    const orderTypeCondition =
      currentItemData?.order?.type !== 'purchase' &&
      currentItemData?.order?.type !== 'estimate';
    const orderVersionCondition = currentOrder?.orderVersion !== 'historical';

    let userId = ctx?.state?.user?.id;

    if (createOrderByEcommerceRoutes.includes(ctx?.originalUrl)) {
      userId = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          tenant: currentOrder?.tenant?.id,
          role: { name: 'Owner' },
        },
      });
    }

    if (orderStatusCondition && orderTypeCondition && orderVersionCondition) {
      if (apiName === 'api::product-order-item.product-order-item') {
        const productItems = await strapi.entityService.findMany(
          'api::product-inventory-item.product-inventory-item',
          {
            filters: {
              uuid: {
                $eq: currentItemData?.itemId,
              },
              businessLocation: {
                id: {
                  $eq: currentOrder?.businessLocation?.id,
                },
              },
            },
            fields: ['id', 'isNegativeCount', 'quantity'],
          },
        );

        if (productItems?.length === 0) {
          handleError(
            'afterCreateOrderItemLifeCycleHook updateOrderTotalOnNewOrderItemAdd',
            `Input should have the same itemId as it's connected inventory Item`,
            new Error(
              `Input should have the same itemId as it's connected inventory Item`,
            ),
          );
        }

        if (currentOrder.type !== 'tradeIn') {
          if (
            productItems?.[0]?.isNegativeCount ||
            productItems?.[0]?.quantity >= quantity
          ) {
            await strapi.entityService.update(
              'api::product-inventory-item.product-inventory-item',
              productItems[0].id,
              {
                data: {
                  quantity: productItems?.[0]?.quantity - quantity,
                },
              },
            );

            const { updatedReceiveEvents } =
              await productInventoryEventService.removeRemainingInReceiveEvents(
                {
                  productItemId: productItems?.[0]?.id,
                  transferQuantity: quantity,
                },
              );
            await strapi.entityService.create(
              'api::product-inventory-item-event.product-inventory-item-event',
              {
                data: {
                  eventType: 'pos order item add',
                  change: quantity.toString(),
                  productInventoryItem: productItems?.[0]?.id,
                  addedBy: userId,
                  businessLocation: currentOrder?.businessLocation?.id,
                  tenant: currentOrder?.tenant?.id,
                  itemContactVendor: currentOrder?.contact?.id ?? undefined,
                  itemVendor: currentOrder?.company?.id ?? undefined,
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
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            productItems?.[0].id,
            {
              data: {
                quantity: productItems?.[0]?.quantity + quantity,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                order: orderId,
                eventType: 'receive',
                change: quantity?.toString(),
                remainingQuantity: quantity,
                productInventoryItem: productItems?.[0]?.id,
                addedBy: userId,
                businessLocation: currentOrder?.businessLocation?.id,
                tenant: currentOrder?.tenant?.id,
                itemCost: price,
                itemVendor: currentOrder?.company?.id ?? undefined,
                itemContactVendor: currentOrder?.contact?.id ?? undefined,
                receiveDate: new Date(),
              },
            },
          );
        }
      }
    }
    if (isCompositeProductItem) return;

    const itemDiscounts = [];

    if (currentOrder?.discounts?.length > 0) {
      await Promise.all(
        currentOrder?.discounts?.map(async (el) => {
          const isUniversalDiscount = await strapi
            .service('api::discount.discount')
            .isUniversal(el?.id);

          const applicableOrderItems = await strapi
            .service('api::discount.discount')
            .getApplicableItems(el?.id, orderId, entityName);
          const normalizedApplicableOrderItems =
            !!isUniversalDiscount && el.type === 'percentage'
              ? [
                  ...(applicableOrderItems.product ?? []),
                  ...(applicableOrderItems.class ?? []),
                  ...(applicableOrderItems.service ?? []),
                  ...(applicableOrderItems.membership ?? []),
                  ...(applicableOrderItems['composite-product'] ?? []),
                ]
              : [...applicableOrderItems];

          const applicableOrderItemsIds = normalizedApplicableOrderItems?.map(
            (el) => el.id,
          );

          if (
            !applicableOrderItemsIds.length ||
            !applicableOrderItemsIds.includes(id) ||
            !applicableOrderItemsIds.includes(id)
          )
            return;

          itemDiscounts.push(el?.id);
        }),
      );
    }

    if (itemDiscounts.length > 0) {
      await strapi.entityService.update(apiName, id, {
        data: {
          discounts: itemDiscounts,
        },
      });
    }
  };
