import { handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateOrderCustomCreationDate = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'Lifecycle helper :: updateOrderCustomCreationDate',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const newOrderCustomCreationDate =
    event?.params?.data?.customCreationDate ??
    event.params?.data?.data?.customCreationDate;

  if (!newOrderCustomCreationDate) return;

  const newDateISOString =
    typeof newOrderCustomCreationDate === 'string'
      ? newOrderCustomCreationDate
      : newOrderCustomCreationDate.toISOString();

  if (newDateISOString === currentOrder?.customCreationDate) return;

  const orderID = event?.params?.where?.id;

  if (currentOrder.type === 'purchase') {
    const orderProductInventoryItemEvents = await strapi.entityService.findMany(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        filters: {
          order: orderID,
        },
        fields: ['id'],
      },
    );

    if (
      orderProductInventoryItemEvents &&
      orderProductInventoryItemEvents?.length > 0
    ) {
      await Promise.all(
        orderProductInventoryItemEvents.map(
          async (productInventoryItemEvent) => {
            await strapi.entityService.update(
              'api::product-inventory-item-event.product-inventory-item-event',
              productInventoryItemEvent.id,
              {
                data: {
                  receiveDate: newOrderCustomCreationDate,
                },
              },
            );
          },
        ),
      );
    }
  } else {
    const orderSalesItemReports = await strapi.entityService.findMany(
      'api::sales-item-report.sales-item-report',
      {
        filters: {
          order: orderID,
        },
        fields: ['id', 'age', 'soldDate'],
      },
    );

    if (orderSalesItemReports && orderSalesItemReports?.length > 0) {
      const salesItemReportService = strapi.service(
        'api::sales-item-report.sales-item-report',
      );

      await Promise.all(
        orderSalesItemReports.map(async (salesItemReport) => {
          const { age: oldAge, soldDate: oldSoldDate } = salesItemReport;

          if (oldAge == null || !oldSoldDate) return;

          const newAge = await salesItemReportService.calculateNewSoldAge({
            oldAge,
            oldSoldDate,
            newSoldDate: newOrderCustomCreationDate,
          });

          await strapi.entityService.update(
            'api::sales-item-report.sales-item-report',
            salesItemReport.id,
            {
              data: {
                age: newAge,
                soldDate: newOrderCustomCreationDate,
              },
            },
          );
        }),
      );
    }
  }
};
