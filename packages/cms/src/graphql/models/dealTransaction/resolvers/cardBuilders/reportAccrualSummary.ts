import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { startCase, toLower } from 'lodash';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  DealTransactionCard,
  currencyWithoutPointsFilter,
  filterPeriodBuilder,
  getTenantFilter,
  orderRevenueRentTypeFilter,
} from './../../helpers/helpers';
import {
  calculateRevenueByItemCategory,
  createRevenueBreakdownCards,
  isPointsTransaction,
  normalizeDate,
  orderItemsPopulateOptions,
} from './../../helpers/reportAccrualSummary/helpers';

export const getReportAccrualSummaryCardsInfo = async (
  userId,
  dates,
  additionalFilters = {},
) => {
  const reportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);
  const discountService = strapi.service('api::discount.discount');

  // 1. Orders shipped in period (for Recognized Revenue, Sales Tax, A/R Created, Applied Deposits)
  const ordersShippedInPeriod = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...reportFilters,
        ...tenantFilter,
        ...orderRevenueRentTypeFilter,
        shippedDate: { $ne: null },
        ...(filterPeriodBuilder(
          dates[0],
          dates[1],
          'shippedDate',
        ) as Any<'api::order.order'>),
      },
      fields: ['total', 'subTotal', 'tax', 'tip', 'shippedDate', 'points'],
      populate: {
        dealTransactions: {
          fields: [
            'paid',
            'status',
            'customCreationDate',
            'transactionCurrency',
          ],
          populate: {
            chartAccount: {
              fields: ['name', 'type'],
            },
            paymentMethod: {
              fields: ['name'],
            },
          },
        },
        ...(orderItemsPopulateOptions as any),
      },
    },
  );

  // 2. Sales item reports for Cost of Goods Sold (orders shipped in period)
  const salesItemReportsCostInPeriod = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        itemCost: { $ne: null },
        ...tenantFilter,
        order: {
          ...(reportFilters?.order ?? {}),
          ...orderRevenueRentTypeFilter,
          shippedDate: { $ne: null },
          ...(filterPeriodBuilder(
            dates[0],
            dates[1],
            'shippedDate',
          ) as Any<'api::sales-item-report.sales-item-report'>),
        },
      },
      fields: ['itemCost'],
    },
  );

  // 3. Paid transactions created in period (for Payments, New Deposits, A/R Collected)
  const paidTransactionsInPeriod = await strapi.entityService.findMany(
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
        status: { $eq: 'Paid' },
        paid: { $gt: 0 },
      },
      fields: ['paid', 'status', 'customCreationDate', 'transactionCurrency'],
      populate: {
        paymentMethod: {
          fields: ['name'],
        },
        chartAccount: {
          fields: ['name', 'type'],
        },
        sellingOrder: {
          fields: ['shippedDate', 'type'],
        },
      },
    },
  );

  // 4. Refund transactions created in period (for Deposit Refunds and Sale Refunds)
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
      fields: ['paid', 'status', 'customCreationDate', 'transactionCurrency'],
      populate: {
        sellingOrder: {
          fields: ['shippedDate'],
        },
        paymentMethod: {
          fields: ['name'],
        },
      },
    },
  );

  // Calculate In Period Recognized Revenue
  const recognizedRevenue = ordersShippedInPeriod.reduce((total, order) => {
    const orderTotal = order.total || 0;
    const orderTax = order.tax || 0;
    const orderTip = order.tip || 0;
    return total + (orderTotal - orderTax - orderTip);
  }, 0);

  // Calculate Revenue by Item Category and create breakdown cards
  const revenueData = calculateRevenueByItemCategory(
    ordersShippedInPeriod as any[],
    discountService,
  );
  const revenueBreakdownCards = createRevenueBreakdownCards(revenueData);

  // Calculate In Period Sales Tax
  const salesTax = ordersShippedInPeriod.reduce(
    (total, order) => total + (order.tax || 0),
    0,
  );

  // Calculate In Period Cost of Goods Sold
  const costOfGoodsSold = salesItemReportsCostInPeriod.reduce(
    (total, item) => total + (item.itemCost || 0),
    0,
  );

  // Calculate In Period Payments (total and by payment method)
  const totalPayments = paidTransactionsInPeriod.reduce(
    (total, transaction: any) => {
      if (isPointsTransaction(transaction)) return total;
      return total + (transaction.paid || 0);
    },
    0,
  );

  // Group payments by payment method (excluding Points)
  const paymentMethodMap = new Map<
    string,
    { id: number; name: string; total: number }
  >();
  let nextId = 2000;

  for (const transaction of paidTransactionsInPeriod as any[]) {
    if (isPointsTransaction(transaction)) continue;

    const paymentMethod = transaction?.paymentMethod;
    if (paymentMethod) {
      const formattedPaymentMethod = startCase(toLower(paymentMethod?.name));
      const paidAmount = transaction.paid ?? 0;

      if (!paymentMethodMap.has(formattedPaymentMethod)) {
        paymentMethodMap.set(formattedPaymentMethod, {
          id: nextId++,
          name: formattedPaymentMethod,
          total: 0,
        });
      }

      const entry = paymentMethodMap.get(formattedPaymentMethod);
      if (entry) {
        entry.total += paidAmount;
      }
    }
  }

  const paymentMethodCards: DealTransactionCard[] = Array.from(
    paymentMethodMap.values(),
  ).map((entry, index) => ({
    ...entry,
    name: `In Period Payments: ${entry.name} Portion`,
    cardImg: [1, 2, 3, 2][index % 4],
    type: 'transactions',
  }));

  // Calculate In Period New Deposits (excluding Points)
  const newDeposits = paidTransactionsInPeriod.reduce(
    (total, transaction: any) => {
      if (isPointsTransaction(transaction)) return total;

      const order = transaction.sellingOrder;
      if (!order) return total;

      const shippedDate = order.shippedDate
        ? normalizeDate(new Date(order.shippedDate))
        : null;
      const paymentDate = transaction.customCreationDate
        ? normalizeDate(new Date(transaction.customCreationDate))
        : null;

      if (!shippedDate || (paymentDate && paymentDate < shippedDate)) {
        return total + (transaction.paid || 0);
      }

      return total;
    },
    0,
  );

  // Calculate In Period Applied Deposits (excluding Points)
  const appliedDeposits = ordersShippedInPeriod.reduce((total, order: any) => {
    if (!order.dealTransactions?.length) return total;

    const shippedDateOnly = normalizeDate(new Date(order.shippedDate));

    const appliedAmount = order.dealTransactions.reduce(
      (sum: number, transaction: any) => {
        if (isPointsTransaction(transaction)) return sum;

        const isIncomeTransaction = transaction.chartAccount?.type === 'income';
        if (
          !isIncomeTransaction ||
          transaction.status !== 'Paid' ||
          !transaction.paid
        ) {
          return sum;
        }

        const transactionDateOnly = transaction.customCreationDate
          ? normalizeDate(new Date(transaction.customCreationDate))
          : null;

        if (transactionDateOnly && transactionDateOnly < shippedDateOnly) {
          return sum + transaction.paid;
        }

        return sum;
      },
      0,
    );

    return total + appliedAmount;
  }, 0);

  // Calculate In Period A/R Collected
  const arCollected = paidTransactionsInPeriod.reduce(
    (total, transaction: any) => {
      const order = transaction.sellingOrder;
      if (!order || !order.shippedDate) return total;

      const shippedDateOnly = normalizeDate(new Date(order.shippedDate));
      const transactionDateOnly = transaction.customCreationDate
        ? normalizeDate(new Date(transaction.customCreationDate))
        : null;

      if (transactionDateOnly && transactionDateOnly > shippedDateOnly) {
        return total + (transaction.paid || 0);
      }

      return total;
    },
    0,
  );

  // Calculate In Period Deposit Refunds (excluding Points)
  const depositRefunds = refundTransactionsInPeriod.reduce(
    (total, transaction: any) => {
      if (isPointsTransaction(transaction)) return total;

      const order = transaction.sellingOrder;

      if (!order?.shippedDate) {
        return total + (transaction.paid || 0);
      }

      return total;
    },
    0,
  );

  // Calculate In Period Sale Refunds
  const saleRefunds = refundTransactionsInPeriod.reduce(
    (total, transaction: any) => {
      const order = transaction.sellingOrder;

      if (order?.shippedDate) {
        return total + (transaction.paid || 0);
      }

      return total;
    },
    0,
  );

  // Calculate In Period A/R Created
  const arCreated = ordersShippedInPeriod.reduce((total, order: any) => {
    const orderTotal = order.total || 0;
    const shippedDateOnly = normalizeDate(new Date(order.shippedDate));

    const paymentsOnOrBeforeShipDate = (order.dealTransactions || []).reduce(
      (sum: number, transaction: any) => {
        const isIncomeTransaction = transaction.chartAccount?.type === 'income';
        if (
          !isIncomeTransaction ||
          transaction.status !== 'Paid' ||
          !transaction.paid
        ) {
          return sum;
        }

        const transactionDateOnly = transaction.customCreationDate
          ? normalizeDate(new Date(transaction.customCreationDate))
          : null;

        if (transactionDateOnly && transactionDateOnly <= shippedDateOnly) {
          return sum + transaction.paid;
        }

        return sum;
      },
      0,
    );

    const arAmount = orderTotal - paymentsOnOrBeforeShipDate;
    return total + (arAmount > 0 ? arAmount : 0);
  }, 0);

  return [
    {
      id: 100,
      name: 'In Period Recognized Revenue',
      total: parseFloat(recognizedRevenue.toFixed(2)),
      cardImg: 1,
      type: 'transactions',
    },
    ...revenueBreakdownCards,
    {
      id: 101,
      name: 'In Period Sales Tax',
      total: parseFloat(salesTax.toFixed(2)),
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 102,
      name: 'In Period Cost of Goods Sold',
      total: parseFloat(costOfGoodsSold.toFixed(2)),
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 103,
      name: 'In Period Payments',
      total: parseFloat(totalPayments.toFixed(2)),
      cardImg: 1,
      type: 'transactions',
    },
    ...paymentMethodCards,
    {
      id: 104,
      name: 'In Period New Deposits',
      total: parseFloat(newDeposits.toFixed(2)),
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 105,
      name: 'In Period Applied Deposits',
      total: parseFloat(appliedDeposits.toFixed(2)),
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 106,
      name: 'In Period A/R Collected',
      total: parseFloat(arCollected.toFixed(2)),
      cardImg: 1,
      type: 'transactions',
    },
    {
      id: 107,
      name: 'In Period Deposit Refunds',
      total: parseFloat(depositRefunds.toFixed(2)),
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 108,
      name: 'In Period Sale Refunds',
      total: parseFloat(saleRefunds.toFixed(2)),
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 109,
      name: 'In Period A/R Created',
      total: parseFloat(arCreated.toFixed(2)),
      cardImg: 1,
      type: 'transactions',
    },
  ];
};
