import { LifecycleHook } from '../../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createProductOrderItemsFromComposite: LifecycleHook = async ({
  params,
  result,
}: AfterLifecycleEvent) => {
  const data = params?.data;

  // Skip creating child items during split operations - splitOrder handles this manually
  if (data?._skipCreateProductOrderItems) {
    return;
  }

  const currentCompositeProduct = await strapi.entityService.findOne(
    'api::composite-product-order-item.composite-product-order-item',
    result.id,
    {
      fields: ['id'],
      populate: {
        compositeProduct: {
          fields: ['id'],
          populate: {
            businessLocation: {
              fields: ['id'],
            },
            compositeProduct: {
              fields: ['id'],
              populate: {
                compositeProductItems: {
                  fields: ['id', 'quantity'],
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
      },
    },
  );

  const compositeProductLocationInfo =
    currentCompositeProduct?.compositeProduct;
  const compositeProduct = compositeProductLocationInfo?.compositeProduct;

  if (!compositeProduct?.compositeProductItems?.length) return;
  const compositeProductItems = compositeProduct?.compositeProductItems || [];

  await Promise.all(
    compositeProductItems.map(async (compositeProductItem) => {
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
          fields: ['id', 'uuid', 'quantity', 'isNegativeCount'],
        },
      );
      if (
        currentInventoryItem?.[0]?.quantity >= compositeProductItem?.quantity ||
        !!currentInventoryItem?.[0]?.isNegativeCount
      ) {
        return strapi.entityService.create(
          'api::product-order-item.product-order-item',
          {
            data: {
              quantity: compositeProductItem?.quantity,
              compositeProductOrderItem: result?.id,
              purchaseType: data.purchaseType,
              product: currentInventoryItem?.[0]?.id,
              order: data.order,
              itemId: currentInventoryItem?.[0]?.uuid,
              price: 0,
              tax: undefined,
              isCompositeProductItem: true,
              isVisibleInDocs: false,
            },
          },
        );
      } else {
        throw new Error('This amount of product is currently unavailable');
      }
    }),
  );
};
