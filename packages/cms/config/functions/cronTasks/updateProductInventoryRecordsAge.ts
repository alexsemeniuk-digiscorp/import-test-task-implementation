import { handleError, handleLogger } from '../../../src/graphql/helpers/errors';
import { TaskType } from './types';

export const updateProductInventoryRecordsAge: TaskType = async ({
  strapi,
}) => {
  handleLogger(
    'info',
    'Cron :: updateProductInventoryRecordsAge',
    'Params :: ',
  );

  const updateAge = async () => {
    try {
      const productInventoryEventService = strapi.service(
        'api::product-inventory-item-event.product-inventory-item-event',
      );
      const limit = 100;
      let recordStart = 0;
      let hasMoreRecords = true;

      while (hasMoreRecords) {
        const productInventoryItemRecords = await strapi.entityService.findMany(
          'api::invt-itm-record.invt-itm-record',
          {
            filters: {
              soldDate: {
                $eq: null,
              },
            },
            fields: ['age'],
            populate: {
              productInventoryItemEvent: {
                fields: ['receiveDate'],
              },
            },
            start: recordStart,
            limit,
          },
        );

        if (
          !productInventoryItemRecords ||
          productInventoryItemRecords.length === 0
        ) {
          hasMoreRecords = false;
        }

        if (
          productInventoryItemRecords &&
          productInventoryItemRecords?.length > 0
        ) {
          await Promise.all(
            productInventoryItemRecords.map(async (record) => {
              const calculatedAge =
                productInventoryEventService.getProductInventoryItemEventAge(
                  record.productInventoryItemEvent,
                );

              if (record.age !== calculatedAge) {
                await strapi.entityService.update(
                  'api::invt-itm-record.invt-itm-record',
                  record.id,
                  {
                    data: {
                      age: calculatedAge,
                    },
                  },
                );
              }
            }),
          );
        }

        recordStart += limit;
      }
    } catch (e) {
      handleError('Cron :: updateProductInventoryRecordsAge', undefined, e);
    }
  };

  await updateAge();
};
