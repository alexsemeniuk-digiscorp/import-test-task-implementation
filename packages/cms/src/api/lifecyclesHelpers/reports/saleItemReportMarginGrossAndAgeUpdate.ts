import { flattenDeep } from 'lodash';
import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../../lifecyclesHelpers/types';
import { beforeCreateProductInventoryItemEventSalesItemReportPopulation } from '../variables';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const saleItemReportMarginGrossAndAgeUpdate: LifecycleHook = async ({
  params,
  result,
}: AfterLifecycleEvent) => {
  // Skip sale item report margin gross and age update during bulk imports for performance
  if (params?.data?._skipSaleItemReportMarginGrossAndAgeUpdate) {
    delete params?.data?._skipSaleItemReportMarginGrossAndAgeUpdate;
    return;
  }

  handleLogger(
    'info',
    'ProductInventoryItemEvent beforeCreateProductInventoryItemEventLifeCycleHook saleItemReportMarginGrossAndAgeUpdate',
    `Params :: ${JSON.stringify(params)}`,
  );

  const entityId = result.id;
  const inventoryItemId = params.data.productInventoryItem;
  const remainingQuantity = Number(params.data.remainingQuantity);
  const change = Number(params.data.change);
  const paramsItemCost = Number(params.data.itemCost);
  const paramsReceiveDate = params.data.receiveDate;

  if (!paramsReceiveDate || !(remainingQuantity != null) || !(change != null)) {
    return;
  }

  const eventQuantity = change - remainingQuantity;

  if (eventQuantity > 0) {
    const productOrderItems = await strapi.entityService.findMany(
      'api::product-order-item.product-order-item',
      {
        filters: {
          product: {
            id: {
              $eq: inventoryItemId,
            },
          },
          order: {
            type: {
              $in: ['sell', 'layaway', 'rent'],
            },
          },
        },
        fields: ['id'],
      },
    );

    const salesItemReports = await Promise.all(
      productOrderItems.map((productOrderItem) => {
        return strapi.entityService.findMany(
          'api::sales-item-report.sales-item-report',
          {
            filters: {
              productOrderItem: {
                id: {
                  $eq: productOrderItem.id,
                },
              },
              age: {
                $eq: 0,
              },
              grossMargin: {
                $eq: 100,
              },
            },
            fields: ['id', 'price', 'createdAt'],
            populate:
              beforeCreateProductInventoryItemEventSalesItemReportPopulation as any,
          },
        ) as any;
      }),
    );

    const slicesSalesItemsReports = flattenDeep(salesItemReports).slice(
      0,
      eventQuantity,
    );

    const discountServices = strapi.service('api::discount.discount');

    await Promise.all(
      slicesSalesItemsReports.map(async (salesItemReport) => {
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
        const createdAtDate = new Date(salesItemReport.createdAt).getTime();
        const receiveDate = new Date(paramsReceiveDate).getTime();
        const calculatedAge = Math.round(
          (createdAtDate - receiveDate) / (1000 * 60 * 60 * 24),
        );

        return await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          salesItemReport.id,
          {
            data: {
              age: calculatedAge,
              grossMargin: calculatedGrossMargin,
              itemCost: paramsItemCost,
              productInventoryItemEvent: entityId,
            },
          },
        );
      }),
    );
  }
};
