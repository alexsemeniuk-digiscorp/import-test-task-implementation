import { handleLogger } from '../../../graphql/helpers/errors';
import { beforeCreateProductInventoryItemEventSalesItemReportPopulation } from '../variables';

export const saleItemReportMarginGrossUpdateOnItemCostChange = async (
  { params },
  currentProductInventoryItemEvent,
) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent beforeUpdateProductInventoryItemEventLifeCycleHook saleItemReportMarginGrossUpdateOnItemCostChange',
    `Params :: ${JSON.stringify(params)}`,
  );

  if (params.data.itemCost === undefined) {
    return;
  }

  const paramsItemCost = Number(params.data.itemCost);
  const currentItemCost = Number(currentProductInventoryItemEvent.itemCost);

  if (paramsItemCost === currentItemCost) {
    return;
  }

  const salesItemReports = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        productInventoryItemEvent: {
          id: {
            $eq: currentProductInventoryItemEvent?.id,
          },
        },
      },
      fields: ['id', 'price', 'createdAt'],
      populate:
        beforeCreateProductInventoryItemEventSalesItemReportPopulation as any,
    },
  );

  if (salesItemReports && salesItemReports?.length > 0) {
    const discountServices = strapi.service('api::discount.discount');

    await Promise.all(
      salesItemReports.map(async (salesItemReport: any) => {
        const orderItem =
          salesItemReport?.productOrderItem ||
          salesItemReport?.compositeProductOrderItem ||
          salesItemReport?.serviceOrderItem ||
          salesItemReport?.membershipOrderItem ||
          salesItemReport?.classOrderItem;

        if (!orderItem) return;

        const discounts = orderItem?.discounts ?? [];
        const order = orderItem?.order;

        const discountAmountPerItem =
          discountServices.getDiscountAmountSumForOrderItem(
            salesItemReport.price,
            1,
            discounts,
            order,
          );

        const itemPriceWithoutDiscount =
          salesItemReport.price - discountAmountPerItem;
        const calculatedGrossMargin =
          itemPriceWithoutDiscount !== 0
            ? ((itemPriceWithoutDiscount - paramsItemCost) /
                itemPriceWithoutDiscount) *
              100
            : 0;

        return await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          salesItemReport.id,
          {
            data: {
              grossMargin: calculatedGrossMargin,
              itemCost: paramsItemCost,
            },
          },
        );
      }),
    );
  }
};
