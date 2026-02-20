import AfterLifecycleEvent = Database.AfterLifecycleEvent;

import { handleLogger } from '../../../graphql/helpers/errors';

export const updateProductOrderItemPriceOnEventItemCostUpdate: AfterLifecycleEvent =
  async ({ params, result }) => {
    handleLogger(
      'info',
      'ProductInventoryItemEvent afterUpdateProductInventoryItemEventLifeCycleHook updateProductOrderItemPriceOnEventItemCostUpdate',
      `Params :: ${JSON.stringify(params)}`,
    );
    const entityId = params.where?.id || result?.id;

    if (!result?.itemCost) return;

    const currentProductInventoryItemEvent = await strapi.entityService.findOne(
      'api::product-inventory-item-event.product-inventory-item-event',
      entityId,
      {
        fields: ['itemCost', 'eventType'],
        populate: {
          productInventoryItem: {
            fields: ['id'],
          },
          order: {
            populate: {
              products: {
                fields: ['id', 'price'],
                populate: {
                  product: {
                    fields: ['id'],
                  },
                },
              },
            },
          },
        },
      },
    );

    const entityItemCost = Number(result?.itemCost);

    if (currentProductInventoryItemEvent?.eventType !== 'receive') return;

    const orderProducts = currentProductInventoryItemEvent?.order?.products;
    const currentProductInventoryItem =
      currentProductInventoryItemEvent?.productInventoryItem;

    if (!orderProducts || !currentProductInventoryItem) return;

    const eventProductOrderItem = orderProducts?.find(
      (productOrderItem) =>
        productOrderItem?.product?.id === currentProductInventoryItem?.id,
    );

    if (
      !eventProductOrderItem ||
      eventProductOrderItem?.price === entityItemCost
    )
      return;

    await strapi.entityService.update(
      'api::product-order-item.product-order-item',
      eventProductOrderItem.id,
      {
        data: {
          price: entityItemCost,
        },
      },
    );
  };
