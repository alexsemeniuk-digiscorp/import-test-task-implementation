import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteSalesItemReportItems: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook deleteSalesItemReportItems',
    `Params :: ${JSON.stringify(params)}`,
  );

  const orderId = params?.data?.order || params?.where?.id;

  if (
    (params?.data?.order && params?.data?.type === 'full') ||
    (params?.where?.id && params?.data?.type !== 'full')
  ) {
    const salesItemReportItems = await strapi.entityService.findMany(
      'api::sales-item-report.sales-item-report',
      {
        filters: {
          order: {
            id: {
              $eq: orderId,
            },
          },
        },
        fields: ['id'],
        populate: {
          productOrderItem: {
            fields: ['id', 'isCompositeProductItem'],
          },
        },
      },
    );

    if (salesItemReportItems.length > 0) {
      const salesItemReportWithoutComposite = salesItemReportItems?.filter(
        (item) => !item.productOrderItem?.isCompositeProductItem,
      );
      await Promise.all(
        salesItemReportWithoutComposite?.map(async (reportItem) => {
          await strapi.entityService.delete(
            'api::sales-item-report.sales-item-report',
            reportItem.id,
          );
        }),
      );
    }
  }
};
