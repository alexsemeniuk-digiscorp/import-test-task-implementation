import { handleLogger } from '../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateProductInventoryItemRecordsAndSalesItemMemoSold = async (
  event: BeforeLifecycleEvent,
  order,
) => {
  handleLogger(
    'info',
    'Lifecycle helper :: updateProductInventoryItemRecordsAndSalesItemMemoSold',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const newMemo = event?.params?.data?.memo ?? event?.params?.data?.data?.memo;

  if (newMemo === null || newMemo === undefined || newMemo === order?.memo)
    return;

  const orderID = event?.params?.where?.id;

  const currentProductInventoryItemRecords =
    await strapi.entityService.findMany(
      'api::invt-itm-record.invt-itm-record',
      {
        filters: {
          sellingOrder: {
            id: {
              $eq: orderID,
            },
          },
        },
        fields: ['id'],
      },
    );

  const currentSalesItemReports = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        order: {
          id: {
            $eq: orderID,
          },
        },
      },
      fields: ['id'],
    },
  );

  if (
    currentProductInventoryItemRecords &&
    currentProductInventoryItemRecords?.length > 0
  ) {
    await Promise.all(
      currentProductInventoryItemRecords.map(
        async (productInventoryItemRecord) => {
          await strapi.entityService.update(
            'api::invt-itm-record.invt-itm-record',
            productInventoryItemRecord.id,
            {
              data: {
                memoSold: Boolean(newMemo) || false,
              },
            },
          );
        },
      ),
    );
  }

  if (currentSalesItemReports && currentSalesItemReports?.length > 0) {
    await Promise.all(
      currentSalesItemReports.map(async (salesItemReport) => {
        await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          salesItemReport.id,
          {
            data: {
              memoSold: Boolean(newMemo) || false,
            },
          },
        );
      }),
    );
  }
};
