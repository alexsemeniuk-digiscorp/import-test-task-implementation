import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import { discountPopulation } from '../../../discount/helpers/variables';
import { taxPopulation } from '../../../tax/helpers/variables';
import {
  calculateAverageGrossMargin,
  calculateAverageOrderItemPrice,
  calculateItemsTotal,
  calculateSalesItemCurrentPaidPreTaxSum,
  calculateTotalItemCosts,
  currentDate,
  dateRanges,
  filterPeriodBuilder,
  getTenantFilter,
} from '../../helpers/helpers';

export const getReportSalesItemCardsInfo = async (
  userId,
  dates,
  additionalFilters = {},
) => {
  const salesItemReportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const salesItemReportItems = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        ...salesItemReportFilters,
        ...tenantFilter,
      },
      fields: ['price'],
    },
  );

  const salesItemReportGrossMarginItems = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        grossMargin: { $ne: null },
        compositeProductOrderItem: {
          id: null,
        },
        membershipOrderItem: {
          id: null,
        },
        classOrderItem: {
          id: null,
        },
        ...salesItemReportFilters,
        ...tenantFilter,
      },
      fields: ['grossMargin', 'type'],
    },
  );

  const salesItemReportGrossMarginItemsInPeriod =
    await strapi.entityService.findMany(
      'api::sales-item-report.sales-item-report',
      {
        filters: {
          grossMargin: { $ne: null },
          compositeProductOrderItem: {
            id: null,
          },
          membershipOrderItem: {
            id: null,
          },
          classOrderItem: {
            id: null,
          },
          ...salesItemReportFilters,
          ...tenantFilter,
          order: {
            ...(salesItemReportFilters?.order ?? {}),
            ...(filterPeriodBuilder(
              dates[0],
              dates[1],
              'customCreationDate',
            ) as Any<'api::sales-item-report.sales-item-report'>),
          },
        },
        fields: ['grossMargin', 'type'],
      },
    );

  const salesItemReportItemsInPeriod = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        ...salesItemReportFilters,
        ...tenantFilter,
        order: {
          ...(salesItemReportFilters?.order ?? {}),
          ...(filterPeriodBuilder(
            dates[0],
            dates[1],
            'customCreationDate',
          ) as Any<'api::sales-item-report.sales-item-report'>),
        },
      },
      fields: ['price'],
      populate: {
        order: {
          fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
          populate: {
            dealTransactions: {
              populate: ['chartAccount'],
              filters: {
                chartAccount: {
                  $or: [
                    {
                      name: {
                        $eq: 'Revenue',
                      },
                    },
                    {
                      name: {
                        $eq: 'Cost of Goods Sold',
                      },
                    },
                  ],
                },
                $and: [
                  {
                    status: {
                      $ne: 'Cancelled',
                    },
                  },
                  {
                    status: {
                      $ne: 'Running',
                    },
                  },
                ],
              },
            },
          },
        },
        productOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        compositeProductOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        serviceOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        membershipOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        classOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
      },
    },
  );

  const salesItemReportItemsByThirtyDays = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        ...salesItemReportFilters,
        ...tenantFilter,
        order: {
          ...(salesItemReportFilters?.order ?? {}),
          ...(filterPeriodBuilder(
            dateRanges?.thirtyDaysAgo.toISOString(),
            currentDate.toISOString(),
            'customCreationDate',
          ) as Any<'api::sales-item-report.sales-item-report'>),
        },
      },
      fields: ['price'],
      populate: {
        order: {
          fields: ['total', 'tip', 'tax', 'subTotal', 'points', 'type'],
          populate: {
            dealTransactions: {
              populate: ['chartAccount'],
              filters: {
                chartAccount: {
                  $or: [
                    {
                      name: {
                        $eq: 'Revenue',
                      },
                    },
                    {
                      name: {
                        $eq: 'Cost of Goods Sold',
                      },
                    },
                  ],
                },
                $and: [
                  {
                    status: {
                      $ne: 'Cancelled',
                    },
                  },
                  {
                    status: {
                      $ne: 'Running',
                    },
                  },
                ],
              },
            },
          },
        },
        productOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        compositeProductOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        serviceOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        membershipOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
        classOrderItem: {
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
          },
        },
      },
    },
  );

  const salesItemReportCostItemsInPeriod = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        itemCost: { $ne: null },
        ...salesItemReportFilters,
        ...tenantFilter,
        order: {
          ...(salesItemReportFilters?.order ?? {}),
          ...(filterPeriodBuilder(
            dates[0],
            dates[1],
            'customCreationDate',
          ) as Any<'api::sales-item-report.sales-item-report'>),
        },
      },
      fields: ['itemCost'],
    },
  );

  const averageGrossMargin = calculateAverageGrossMargin(
    salesItemReportGrossMarginItems,
  );
  const averageGrossMarginInPeriod = calculateAverageGrossMargin(
    salesItemReportGrossMarginItemsInPeriod,
  );
  const averageProductsGrossMargin = calculateAverageGrossMargin(
    salesItemReportGrossMarginItems.filter(
      (salesItemReport) => salesItemReport?.type === 'product',
    ),
  );
  const averageProductsGrossMarginInPeriod = calculateAverageGrossMargin(
    salesItemReportGrossMarginItemsInPeriod.filter(
      (salesItemReport) => salesItemReport?.type === 'product',
    ),
  );
  const itemsByPeriodSummary = calculateItemsTotal(
    salesItemReportItemsInPeriod,
  );
  const itemsByThirtyDaysSummary = calculateItemsTotal(
    salesItemReportItemsByThirtyDays,
  );
  const averageOrderItemPrice =
    calculateAverageOrderItemPrice(salesItemReportItems);
  const totalItemCostsInPeriod = calculateTotalItemCosts(
    salesItemReportCostItemsInPeriod,
  );
  const currentPaidPreTaxByPeriodSummary =
    calculateSalesItemCurrentPaidPreTaxSum(salesItemReportItemsInPeriod);
  const currentPaidPreTaxByThirtyDaysSummary =
    calculateSalesItemCurrentPaidPreTaxSum(salesItemReportItemsByThirtyDays);

  return [
    {
      id: 30,
      name: 'Average Gross Margin',
      total: averageGrossMargin,
      cardImg: 1,
      type: 'inPercentage',
    },
    {
      id: 31,
      name: 'Average Gross Margin In Period',
      total: averageGrossMarginInPeriod,
      cardImg: 2,
      type: 'inPercentage',
    },
    {
      id: 32,
      name: 'Average Products Gross Margin',
      total: averageProductsGrossMargin,
      cardImg: 3,
      type: 'inPercentage',
    },
    {
      id: 33,
      name: 'Products Gross Margin In Period',
      total: averageProductsGrossMarginInPeriod,
      cardImg: 1,
      type: 'inPercentage',
    },
    {
      id: 34,
      name: 'Past 30 days',
      total: itemsByThirtyDaysSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 35,
      name: 'Paid In Past 30 days',
      total: currentPaidPreTaxByThirtyDaysSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 36,
      name: 'In Period',
      total: itemsByPeriodSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 37,
      name: 'Paid In Period',
      total: currentPaidPreTaxByPeriodSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 38,
      name: 'Average Item Price',
      total: averageOrderItemPrice,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 39,
      name: 'Cost In Period',
      total: totalItemCostsInPeriod,
      cardImg: 1,
      type: 'transactions',
    },
  ];
};
