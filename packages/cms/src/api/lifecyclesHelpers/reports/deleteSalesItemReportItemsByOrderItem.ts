import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteSalesItemReportItemsByOrderItem: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeDeleteOrderItemLifeCycleHook deleteSalesItemReportItemsByOrderItem',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const apiName = event.model.uid;
  const entityId = event.params?.where?.id;

  const salesItemReportService = strapi.service(
    'api::sales-item-report.sales-item-report',
  );
  const salesItemReportFilter =
    await salesItemReportService.getSalesItemReportFilter({
      apiName,
      entityId,
    });

  const salesItemReportItems = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        ...salesItemReportFilter,
      },
      fields: ['id'],
      populate: {
        productOrderItem: {
          fields: ['isCompositeProductItem'],
        },
      },
    },
  );

  if (salesItemReportItems.length > 0) {
    const salesItemReportWithoutComposite = salesItemReportItems?.filter(
      (item) => !item.productOrderItem?.isCompositeProductItem,
    );
    await Promise.all(
      salesItemReportWithoutComposite.map(async (reportItem) => {
        await strapi.entityService.delete(
          'api::sales-item-report.sales-item-report',
          reportItem.id,
        );
      }),
    );
  }
};
