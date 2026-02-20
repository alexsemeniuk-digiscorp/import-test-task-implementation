import { handleLogger } from '../../../graphql/helpers/errors';

export const updateProductInventoryItemRecordsPrice = async (
  { params },
  currentProductInventoryItemEvent,
) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent beforeUpdateProductInventoryItemEventLifeCycleHook updateProductInventoryItemRecordsPrice',
    `Params :: ${JSON.stringify(params)}`,
  );
  const { data } = params;

  if (!data?.itemCost) return;

  const entityItemCost = Number(data?.itemCost);
  const currentItemCost = Number(currentProductInventoryItemEvent.itemCost);

  if (
    currentProductInventoryItemEvent?.eventType !== 'receive' ||
    entityItemCost === currentItemCost
  )
    return;

  const productInventoryItemRecords =
    currentProductInventoryItemEvent?.productInventoryItemRecords;

  if (!productInventoryItemRecords || productInventoryItemRecords?.length === 0)
    return;

  const productInventoryEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const { calculatedGrossMargin } =
    productInventoryEventService.getProductInventoryItemEventGrossMargin(
      currentProductInventoryItemEvent,
      undefined,
      undefined,
      undefined,
      entityItemCost,
    );

  await Promise.all(
    productInventoryItemRecords.map(
      async (productInventoryItemRecord) =>
        await strapi.entityService.update(
          'api::invt-itm-record.invt-itm-record',
          productInventoryItemRecord.id,
          {
            data: {
              grossMargin: calculatedGrossMargin,
            },
          },
        ),
    ),
  );
};
