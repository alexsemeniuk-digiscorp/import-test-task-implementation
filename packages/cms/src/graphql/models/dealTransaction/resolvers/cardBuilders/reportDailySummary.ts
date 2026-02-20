import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import { discountPopulation } from '../../../discount/helpers/variables';
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

export const getReportDailySummaryCardsInfo = async (
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
      fields: ['type', 'total', 'subTotal', 'tax'],
      populate: {
        dealTransactions: {
          fields: ['paid', 'status'],
          populate: {
            paymentMethod: {
              fields: ['name'],
            },
            chartAccount: {
              fields: ['name'],
            },
          },
        },
        products: {
          fields: ['price', 'quantity', 'isCompositeProductItem'],
          populate: {
            discounts: discountPopulation as any,
          },
        },
        compositeProducts: {
          fields: ['price', 'quantity'],
          populate: {
            discounts: discountPopulation as any,
          },
        },
        services: {
          fields: ['price', 'quantity'],
          populate: {
            discounts: discountPopulation as any,
          },
        },
        memberships: {
          fields: ['price', 'quantity'],
        },
        classes: {
          fields: ['price', 'quantity'],
        },
        contact: {
          fields: ['id'],
        },
        company: {
          fields: ['id'],
        },
        salesItemReports: {
          fields: ['grossMargin', 'type'],
        },
      },
    },
  );

  const ordersAmoutPaidPreTaxByPeriod = await strapi.entityService.findMany(
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

  const ordersByThirtyDaysSummary = calculateOrdersTotal(ordersByThirtyDays);
  const ordersByNinetyDaysSummary = calculateOrdersTotal(ordersByNinetyDays);
  const ordersByCurrentYearSummary = calculateOrdersTotal(ordersByCurrentYear);
  const averageOrderItemPrice =
    calculateAverageOrderItemPrice(salesItemReportItems);
  const {
    ordersTotal: ordersByPeriodSummary,
    productsPortion,
    compositeProductsPortion,
    servicesPortion,
    layawayOrdersTotal,
    ordersTaxTotal,
    numberOfOrders,
    numberOfItemsSold,
    averageOrderTotal,
    numberOfOrderCustomers,
    averageGrossMargin,
    averageProductsGrossMargin,
    dailySummaryDealTransactionsCards,
    refundedTransactionsSummary,
  } = calculateOrdersData(ordersByPeriod);
  const ordersPaidPreTaxByPeriodSummary = calculateOrdersAmountPaidPreTax(
    ordersAmoutPaidPreTaxByPeriod,
  );
  const refundTransactionsInPeriodSummary =
    calculateRefundedSummaryFromTransactions(refundTransactionsInPeriod);

  return [
    {
      id: 50,
      name: 'In Period',
      total: ordersByPeriodSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 51,
      name: 'Paid In Period',
      total: ordersPaidPreTaxByPeriodSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 52,
      name: 'Refunds in Period',
      total: refundTransactionsInPeriodSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 53,
      name: 'Refunds for Orders in Period',
      total: refundedTransactionsSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 54,
      name: 'Past 30 days',
      total: ordersByThirtyDaysSummary,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 55,
      name: 'Past 90 days',
      total: ordersByNinetyDaysSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 56,
      name: 'Year to Date',
      total: ordersByCurrentYearSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 57,
      name: 'Average Item Price',
      total: averageOrderItemPrice,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 58,
      name: 'Products',
      total: productsPortion,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 59,
      name: 'Composite Products',
      total: compositeProductsPortion,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 60,
      name: 'Services',
      total: servicesPortion,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 61,
      name: 'Layaways',
      total: layawayOrdersTotal,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 62,
      name: 'Tax',
      total: ordersTaxTotal,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 63,
      name: 'Number Of Orders',
      total: numberOfOrders,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 64,
      name: 'Items Sold',
      total: numberOfItemsSold,
      cardImg: 3,
      type: 'employees',
    },
    {
      id: 65,
      name: 'Average Order',
      total: averageOrderTotal,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 66,
      name: 'Number Of Customers',
      total: numberOfOrderCustomers,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 67,
      name: 'Gross Margin',
      total: averageGrossMargin,
      cardImg: 3,
      type: 'inPercentage',
    },
    {
      id: 68,
      name: 'Products Gross Margin',
      total: averageProductsGrossMargin,
      cardImg: 1,
      type: 'inPercentage',
    },
    ...dailySummaryDealTransactionsCards,
  ];
};
