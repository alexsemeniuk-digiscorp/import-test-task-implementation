import { errors } from '@strapi/utils';
import { handleLogger } from '../../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;
const { ApplicationError } = errors;

export const updateProductOrderItemsInsideComposite = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'ORDER COMPOSITE_PRODUCT_ITEM beforeUpdateLifecycleHook updateProductOrderItemsInsideComposite',
    `Params :: ${JSON.stringify(event?.params)}`,
  );
  const { data } = event.params;
  const compositeProductQuantity = data?.quantity ?? 1;

  const compositeProductLocationInfo = currentItemData?.compositeProduct;

  const compositeProduct = compositeProductLocationInfo?.compositeProduct;
  const compositeProductItems = compositeProduct?.compositeProductItems || [];

  const productOrderItemsInsideComposite = currentItemData?.productOrderItems;

  if (productOrderItemsInsideComposite?.length) {
    await Promise.all(
      compositeProductItems.map(async (compositeProductItem, index) => {
        const updatedProductOrderItemQuantity =
          compositeProductQuantity * compositeProductItem?.quantity;

        if (!updatedProductOrderItemQuantity) return;

        const currentInventoryItem = await strapi.entityService.findMany(
          'api::product-inventory-item.product-inventory-item',
          {
            filters: {
              product: {
                id: { $eq: compositeProductItem?.product?.id },
              },
              businessLocation: {
                id: {
                  $eq: compositeProductLocationInfo?.businessLocation?.id,
                },
              },
            },
            fields: ['id', 'quantity', 'isNegativeCount'],
          },
        );

        if (
          currentInventoryItem?.[0]?.quantity >=
            updatedProductOrderItemQuantity - 1 ||
          !!currentInventoryItem?.[0]?.isNegativeCount
        ) {
          return strapi.entityService.update(
            'api::product-order-item.product-order-item',
            productOrderItemsInsideComposite?.[index]?.id,
            {
              data: {
                quantity: updatedProductOrderItemQuantity,
              },
            },
          );
        } else {
          throw new ApplicationError(
            'Custom: This amount of product is currently unavailable',
          );
        }
      }),
    );
  }
};
