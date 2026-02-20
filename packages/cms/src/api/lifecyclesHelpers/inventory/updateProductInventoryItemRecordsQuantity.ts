import { handleLogger } from '../../../graphql/helpers/errors';

export const updateProductInventoryItemRecordsQuantity = async (
  { params },
  currentProductInventoryItemEvent,
) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent beforeUpdateProductInventoryItemEventLifeCycleHook updateProductInventoryItemRecordsQuantity',
    `Params :: ${JSON.stringify(params)}`,
  );
  const { data } = params;

  if (!data?.change) return;

  const entityChange = Number(data?.change);
  const currentItemChange = Number(currentProductInventoryItemEvent.change);

  if (
    currentProductInventoryItemEvent?.eventType !== 'receive' ||
    entityChange === currentItemChange
  )
    return;

  if (entityChange > currentItemChange) {
    const quantityDifference = entityChange - currentItemChange;

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

    const createRecordsForQuantity = async (quantity: number) => {
      const promises = [];
      for (let i = 0; i < quantity; i++) {
        const recordData = {
          productInventoryItemEvent: currentProductInventoryItemEvent?.id,
          productInventoryItem:
            currentProductInventoryItemEvent?.productInventoryItem?.id,
          tenant: currentProductInventoryItemEvent?.tenant?.id,
          age: calculatedAge,
          grossMargin: calculatedGrossMargin,
          price: calculatedItemPrice,
          memoTaken: currentProductInventoryItemEvent?.memo ?? false,
          memoSold: false,
        };

        promises.push(
          strapi.entityService.create('api::invt-itm-record.invt-itm-record', {
            data: recordData,
          }),
        );
      }
      await Promise.all(promises);
    };

    await createRecordsForQuantity(quantityDifference);
  } else if (entityChange < currentItemChange) {
    const productInventoryItemRecords = await strapi.entityService.findMany(
      'api::invt-itm-record.invt-itm-record',
      {
        filters: {
          productInventoryItemEvent: {
            id: {
              $eq: currentProductInventoryItemEvent?.id,
            },
          },
        },
        fields: ['id'],
        sort: ['createdAt:desc'],
      },
    );

    if (
      productInventoryItemRecords &&
      productInventoryItemRecords?.length > 0
    ) {
      const quantityDifference = currentItemChange - entityChange;

      const productInventoryItemRecordsToDelete =
        productInventoryItemRecords.slice(0, quantityDifference);

      await Promise.all(
        productInventoryItemRecordsToDelete.map(
          async (productInventoryItemRecord) => {
            await strapi.entityService.delete(
              'api::invt-itm-record.invt-itm-record',
              productInventoryItemRecord.id,
            );
          },
        ),
      );
    }
  }
};
