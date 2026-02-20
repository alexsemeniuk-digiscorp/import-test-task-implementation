import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createProductInventoryItemRecords: LifecycleHook = async ({
  params,
  result,
}: AfterLifecycleEvent) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent afterCreateProductInventoryItemEventLifeCycleHook createProductInventoryItemRecords',
    `Params :: ${JSON.stringify(params)}`,
  );
  const { data } = params;

  if (data?.eventType !== 'receive') return;
  if (data?.isImported) return;

  const currentProductInventoryItemEvent = await strapi.entityService.findOne(
    'api::product-inventory-item-event.product-inventory-item-event',
    result.id,
    {
      fields: [
        'id',
        'remainingQuantity',
        'itemCost',
        'memo',
        'receiveDate',
        'change',
      ],
      populate: {
        productInventoryItem: {
          fields: ['id', 'price'],
          populate: {
            product: {
              fields: ['id', 'multiplier', 'defaultPrice'],
            },
          },
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const { remainingQuantity, change, receiveDate } =
    currentProductInventoryItemEvent;

  const changeNumber = Number(change) || 0;

  if (changeNumber > 0) {
    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    const calculatedAge =
      productInventoryEventService.getProductInventoryItemEventAge(
        currentProductInventoryItemEvent,
      );
    const { calculatedGrossMargin, calculatedItemPrice } =
      productInventoryEventService.getProductInventoryItemEventGrossMargin(
        currentProductInventoryItemEvent,
      );

    const createRecordsForQuantity = async (
      quantity: number,
      soldDate?: string | Date,
    ) => {
      const promises = [];
      for (let i = 0; i < quantity; i++) {
        const recordData = {
          productInventoryItemEvent: result.id,
          productInventoryItem:
            currentProductInventoryItemEvent?.productInventoryItem?.id,
          tenant: currentProductInventoryItemEvent?.tenant?.id,
          age: calculatedAge,
          grossMargin: calculatedGrossMargin,
          price: calculatedItemPrice,
          memoTaken: currentProductInventoryItemEvent?.memo ?? false,
          memoSold: false,
          ...(soldDate && { soldDate }),
        };

        promises.push(
          strapi.entityService.create('api::invt-itm-record.invt-itm-record', {
            data: recordData,
          }),
        );
      }
      await Promise.all(promises);
    };

    // Calculate how many records are unsold vs already sold
    const unsoldQuantity = Math.min(remainingQuantity, changeNumber);
    const soldQuantity = changeNumber - unsoldQuantity;

    // Create records for unsold items (without soldDate)
    if (unsoldQuantity > 0) {
      await createRecordsForQuantity(unsoldQuantity);
    }

    // Create records for already sold items (with soldDate = receiveDate)
    if (soldQuantity > 0) {
      await createRecordsForQuantity(soldQuantity, receiveDate);
    }
  }
};
