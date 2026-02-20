import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import { discountPopulation } from '../../../discount/helpers/variables';
import {
  calculateOrdersData,
  calculateRefundedSummaryFromTransactions,
  currencyWithoutPointsFilter,
  filterPeriodBuilder,
  getTenantFilter,
  orderRevenueTypeFilter,
} from '../../helpers/helpers';

export const getReportTaxesCardsInfo = async (
  userId,
  dates,
  taxesIds,
  type,
  additionalFilters = {},
) => {
  const taxesReportFilters = addDollarToFilterKeys(additionalFilters);
  const taxReportService = strapi.service('api::order.order');
  const tenantFilter = await getTenantFilter(userId);

  const getTaxesTotalByPeriod = await taxReportService.getTotalTaxSum(
    tenantFilter,
    dates,
    taxesReportFilters,
  );

  const getSpecifiedTaxPortionsSum =
    type === 'platform'
      ? await taxReportService.getSpecifiedTaxPortionsSum(
          tenantFilter,
          dates,
          taxesIds?.length ? taxesIds : [],
          taxesReportFilters,
        )
      : undefined;

  const { totalSum, preTaxSalesSum } =
    await taxReportService.getOrderAmountsCalculationSum(
      tenantFilter,
      dates,
      taxesReportFilters,
    );

  const { taxableSales, nonTaxableSales } =
    await taxReportService.getTaxableAndNonTaxableSales(
      tenantFilter,
      dates,
      taxesReportFilters,
    );

  const getSpecifiedTaxPortionsAdjustedPricesSum =
    type === 'platform'
      ? await taxReportService.getSpecifiedTaxPortionsAdjustedPricesSum(
          tenantFilter,
          dates,
          // Include 0 to capture items without tax applied
          taxesIds?.length ? [...taxesIds, 0] : [0],
          taxesReportFilters,
        )
      : undefined;

  const ordersByPeriod = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...taxesReportFilters,
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

  const { refundedTransactionsSummary } = calculateOrdersData(ordersByPeriod);
  const refundTransactionsInPeriodSummary =
    calculateRefundedSummaryFromTransactions(refundTransactionsInPeriod);

  return [
    {
      id: 22,
      name: 'Tax Total in Period',
      total: getTaxesTotalByPeriod,
      cardImg: 1,
      type: 'transactions',
    },
    type === 'platform'
      ? {
          id: 23,
          name: 'Tax Portions Totals in Period',
          total: getSpecifiedTaxPortionsSum,
          cardImg: 2,
          type: 'transactions',
        }
      : {},
    {
      id: 24,
      name: 'Order Amount in Period ',
      total: totalSum,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 25,
      name: 'Order Amount Pre Tax in Period',
      total: preTaxSalesSum,
      cardImg: 1,
      type: 'transactions',
    },
    type === 'platform'
      ? {
          id: 26,
          name: 'Order Portions Amount in Period',
          total: getSpecifiedTaxPortionsAdjustedPricesSum,
          cardImg: 2,
          type: 'transactions',
        }
      : {},
    {
      id: 27,
      name: 'Refunds in Period',
      total: refundTransactionsInPeriodSummary,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 28,
      name: 'Refunds for Orders in Period',
      total: refundedTransactionsSummary,
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 29,
      name: 'Taxable Sales',
      total: taxableSales,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 30,
      name: 'Non-Taxable Sales',
      total: nonTaxableSales,
      cardImg: 3,
      type: 'transactions',
    },
  ];
};
