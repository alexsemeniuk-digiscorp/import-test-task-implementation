import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';

export const updateProductInventoryItemRecordsOnProductInventoryItemUpdate: LifecycleHook =
  async ({ params }) => {
    handleLogger(
      'info',
      'ProductInventoryItem beforeUpdateProductInventoryEventLifeCycleHook updateProductInventoryItemRecordsOnProductInventoryItemUpdate',
      `Params :: ${JSON.stringify(params)}`,
    );
    const { data, where } = params;
    const entityId = where?.id;
    const entityPrice = data?.price;

    if (entityPrice == null) return;

    const currentProductInventoryItemRecords =
      await strapi.entityService.findMany(
        'api::invt-itm-record.invt-itm-record',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: entityId,
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
              entityPrice,
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
