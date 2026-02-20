import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateAverageOrderItemPrice,
  calculateOrdersAmountPaidPreTax,
  calculateOrdersData,
  calculateOrdersTotal,
  calculateRefundedSummaryFromTransactions,
  currencyWithoutPointsFilter,
  dateRanges,
  endOfCurrentDate,
  filterPeriodBuilder,
  getTenantFilter,
  orderRevenueTypeFilter,
} from './../../helpers/helpers';

export const getReportSellingCardsInfo = async (
  userId,
  dates,
  additionalFilters = {},
) => {
  const sellingReportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const ordersByPeriod = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...sellingReportFilters,
        ...tenantFilter,
        ...orderRevenueTypeFilter,
        ...(filterPeriodBuilder(
          dates[0],
          dates[1],
          'customCreationDate',
        ) as Any<'api::order.order'>),
      },
      fields: ['total', 'tax', 'tip'],
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
        salesItemReports: {
          fields: ['grossMargin', 'type'],
        },
      },
    },
  );

  const ordersByThirtyDays = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...sellingReportFilters,
        ...tenantFilter,
        ...orderRevenueTypeFilter,
        ...(filterPeriodBuilder(
          dateRanges?.thirtyDaysAgo.toISOString(),
          endOfCurrentDate.toISOString(),
          'customCreationDate',
        ) as Any<'api::order.order'>),
      },
      fields: ['total', 'tax'],
    },
  );

  const ordersByNinetyDays = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...sellingReportFilters,
        ...tenantFilter,
        ...orderRevenueTypeFilter,
        ...(filterPeriodBuilder(
          dateRanges?.ninetyDaysAgo.toISOString(),
          endOfCurrentDate.toISOString(),
          'customCreationDate',
        ) as Any<'api::order.order'>),
      },
      fields: ['total', 'tax'],
    },
  );

  const ordersByCurrentYear = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...sellingReportFilters,
        ...tenantFilter,
        ...orderRevenueTypeFilter,
        ...(filterPeriodBuilder(
          dateRanges?.beginningOfThisYear.toISOString(),
          endOfCurrentDate.toISOString(),
          'customCreationDate',
        ) as Any<'api::order.order'>),
      },
      fields: ['total', 'tax'],
    },
  );

  const salesItemReportItems = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        order: {
          ...sellingReportFilters,
          ...tenantFilter,
          ...orderRevenueTypeFilter,
        },
      },
      fields: ['price'],
    },
  );

  const refundTransactionsInPeriod = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...currencyWithoutPointsFilter,
        ...(filterPeriodBuilder(
          dates[0],
          dates[1],
          'customCreationDate',
        ) as Any<'api::deal-transaction.deal-transaction'>),
        chartAccount: {
          type: 'income',
        },
        status: { $eq: 'Refunded' },
      },
      fields: ['paid', 'status'],
    },
  );

  const ordersByPeriodSummary = calculateOrdersTotal(ordersByPeriod);
  const ordersByThirtyDaysSummary = calculateOrdersTotal(ordersByThirtyDays);
  const ordersByNinetyDaysSummary = calculateOrdersTotal(ordersByNinetyDays);
  const ordersByCurrentYearSummary = calculateOrdersTotal(ordersByCurrentYear);
  const averageOrderItemPrice =
    calculateAverageOrderItemPrice(salesItemReportItems);
  const ordersPaidPreTaxByPeriodSummary =
    calculateOrdersAmountPaidPreTax(ordersByPeriod);
  const {
    refundedTransactionsSummary,
    averageGrossMargin,
    averageProductsGrossMargin,
  } = calculateOrdersData(ordersByPeriod);
  const refundTransactionsInPeriodSummary =
    calculateRefundedSummaryFromTransactions(refundTransactionsInPeriod);

  return [
    {
      id: 16,
      name: 'In Period',
      total: ordersByPeriodSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 17,
      name: 'Paid In Period',
      total: ordersPaidPreTaxByPeriodSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 18,
      name: 'Refunds in Period',
      total: refundTransactionsInPeriodSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 19,
      name: 'Refunds for Orders in Period',
      total: refundedTransactionsSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 20,
      name: 'Past 30 days',
      total: ordersByThirtyDaysSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 21,
      name: 'Past 90 days',
      total: ordersByNinetyDaysSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 22,
      name: 'Year to Date',
      total: ordersByCurrentYearSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 23,
      name: 'Average Item Price',
      total: averageOrderItemPrice,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 24,
      name: 'Gross Margin',
      total: averageGrossMargin,
      cardImg: 3,
      type: 'inPercentage',
    },
    {
      id: 25,
      name: 'Products Gross Margin',
      total: averageProductsGrossMargin,
      cardImg: 1,
      type: 'inPercentage',
    },
  ];
};
