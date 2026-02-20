import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';

export const updateProductInventoryItemRecordsOnProductUpdate: LifecycleHook =
  async ({ params }) => {
    handleLogger(
      'info',
      'Product beforeUpdateProductLifeCycleHook updateProductInventoryItemRecordsOnProductUpdate',
      `Params :: ${JSON.stringify(params)}`,
    );
    const { data, where } = params;
    const entityId = where?.id;
    const entityMultiplier = data?.multiplier;
    const entityDefaultPrice = data?.defaultPrice;

    if (entityMultiplier == null && entityDefaultPrice == null) return;

    const currentProductInventoryItemRecords =
      await strapi.entityService.findMany(
        'api::invt-itm-record.invt-itm-record',
        {
          filters: {
            productInventoryItem: {
              product: {
                id: {
                  $eq: entityId,
                },
              },
            },
            soldDate: {
              $eq: null,
            },
          },
          fields: ['id'],
          populate: {
            productInventoryItemEvent: {
              fields: ['id', 'itemCost'],
              populate: {
                productInventoryItem: {
                  fields: ['id', 'price'],
                  populate: {
                    product: {
                      fields: ['id', 'multiplier', 'defaultPrice'],
                    },
                  },
                },
              },
            },
          },
        },
      );

    if (
      currentProductInventoryItemRecords &&
      currentProductInventoryItemRecords?.length > 0
    ) {
      const productInventoryEventService = strapi.service(
        'api::product-inventory-item-event.product-inventory-item-event',
      );

      const createRecordsForQuantity = async (quantity: number) => {
        const promises = [];
        for (let i = 0; i < quantity; i++) {
          const { calculatedGrossMargin, calculatedItemPrice } =
            productInventoryEventService.getProductInventoryItemEventGrossMargin(
              currentProductInventoryItemRecords?.[i]
                ?.productInventoryItemEvent,
              undefined,
              entityMultiplier,
              entityDefaultPrice,
            );

          promises.push(
            strapi.entityService.update(
              'api::invt-itm-record.invt-itm-record',
              currentProductInventoryItemRecords?.[i]?.id,
              {
                data: {
                  grossMargin: calculatedGrossMargin,
                  price: calculatedItemPrice,
                },
              },
            ),
          );
        }
        await Promise.all(promises);
      };

      await createRecordsForQuantity(
        currentProductInventoryItemRecords?.length,
      );
    }
  };
