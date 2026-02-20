import { startCase, toLower } from 'lodash';
import {
  NexusGenEnums,
  NexusGenFieldTypes,
  NexusGenRootTypes,
} from '../../../../types/generated/graphql';
import { addDollarToFilterKeys } from '../../../helpers/addDollarToFilterKeys';
import {
  AccountNames,
  ChartAccountWithPopulatedTransactions,
} from '../types/types';

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const currentDate = new Date();
export const currentYear = new Date().getFullYear();
export const currentMonth = new Date().getMonth();
export const currentDay = new Date().getDate();
export const startOfSixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);

export const endOfCurrentDate = (() => {
  const date = new Date();
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
})();

export const beginningOfToday = new Date(currentYear, currentMonth, currentDay);

export const beginningOfTomorrow = new Date(
  currentYear,
  currentMonth,
  currentDay + 1,
);

export const beginningOfYesterday = new Date(
  currentYear,
  currentMonth,
  currentDay - 1,
);

export const lastMonthSameDay = new Date(
  currentYear,
  currentMonth - 1,
  currentDay,
);

export const beginningOfLastMonth = new Date(currentYear, currentMonth - 1, 1);

export const lastYearSameDay = new Date(
  currentYear - 1,
  currentMonth,
  currentDay,
);

export const beginningOfLastYear = new Date(currentYear - 1, 0, 1);

export const beginningOfThisYear = new Date(currentYear, 0, 1);

export const beginningOfThisMonth = new Date(currentYear, currentMonth, 1);

const beginningOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);

const thirtyDaysAgo = new Date(endOfCurrentDate);
thirtyDaysAgo.setDate(currentDay - 30);

const ninetyDaysAgo = new Date(endOfCurrentDate);
ninetyDaysAgo.setDate(currentDay - 90);

const oneDayAgo = new Date(endOfCurrentDate);
oneDayAgo.setDate(currentDay - 1);

const sevenDaysAgo = new Date(endOfCurrentDate);
sevenDaysAgo.setDate(currentDay - 7);

export const accountsNames: AccountNames = [
  'Revenue',
  'Cost of Goods Sold',
  'Gross Profit',
  'Expenses',
  'Pre Tax Income',
  'Taxes',
  'Net Income',
  'Inventory Shrinkage',
];

export const dateRanges = {
  beginningOfThisYear,
  beginningOfPrevMonth,
  beginningOfThisMonth,
  thirtyDaysAgo,
  ninetyDaysAgo,
  oneDayAgo,
  sevenDaysAgo,
};

export const orderRevenueTypeFilter = {
  $or: [
    {
      type: { $eq: 'sell' as NexusGenEnums['ENUM_ORDER_TYPE'] },
    },
    {
      type: { $eq: 'layaway' as NexusGenEnums['ENUM_ORDER_TYPE'] },
    },
  ],
};

export const orderRevenueTypeArray = ['sell', 'layaway'];

export const orderRevenueRentTypeFilter = {
  $or: [
    {
      type: { $eq: 'sell' as NexusGenEnums['ENUM_ORDER_TYPE'] },
    },
    {
      type: { $eq: 'layaway' as NexusGenEnums['ENUM_ORDER_TYPE'] },
    },
    {
      type: { $eq: 'rent' as NexusGenEnums['ENUM_ORDER_TYPE'] },
    },
  ],
};

export const orderRevenueRentTypeArray = ['sell', 'layaway', 'rent'];

export const currencyWithoutPointsFilter = {
  $or: [
    {
      transactionCurrency: {
        $ne: 'POINTS',
      },
    },
    {
      transactionCurrency: {
        $eq: null,
      },
    },
  ],
};

export const calculateYearlyAmount = (chart) => {
  if (chart.dealTransactions) {
    if (chart.name === 'Revenue') {
      return Object.values(
        chart?.dealTransactions?.reduce(
          (acc, transaction: NexusGenFieldTypes['DealTransaction']) => {
            const year = new Date(
              transaction?.customCreationDate ?? transaction?.dueDate,
            )?.getFullYear();
            const transactionOrder =
              transaction?.sellingOrder as NexusGenFieldTypes['Order'];

            const transactionTotal = transaction?.paid
              ? transaction?.paid -
                (transaction?.paid / (transactionOrder?.total || 1)) *
                  (transactionOrder?.tax || 0)
              : 0;

            if (transaction?.status === 'Refunded') {
              acc[year] = {
                year,
                amount: (acc[year]?.amount || 0) - transactionTotal,
              };
              return acc;
            } else {
              acc[year] = {
                year,
                amount: (acc[year]?.amount || 0) + transactionTotal,
              };
              return acc;
            }
          },
          {} as Record<number, { year: number; amount: number }>,
        ),
      );
    } else {
      return Object.values(
        chart?.dealTransactions?.reduce(
          (acc, transaction: NexusGenRootTypes['DealTransaction']) => {
            const year = new Date(
              transaction?.customCreationDate ?? transaction?.dueDate,
            )?.getFullYear();
            acc[year] = {
              year,
              amount: (acc[year]?.amount || 0) + transaction?.paid,
            };
            return acc;
          },
          {} as Record<number, { year: number; amount: number }>,
        ),
      );
    }
  } else {
    return [];
  }
};

export const getAccountYearTotals = (accountCharts, chartName) => {
  const account = accountCharts.find(
    (account) => account.name === chartName,
  ) as NexusGenRootTypes['ChartAccount'];
  return calculateYearlyAmount(
    account as ChartAccountWithPopulatedTransactions,
  );
};
export const combineYearlyArrays = (mainArray, subtractArray) => {
  return mainArray.map((item1) => {
    const matchingItem2 = subtractArray?.find(
      (item2) => item2?.year === item1?.year,
    );
    const amount = matchingItem2
      ? item1.amount - matchingItem2.amount
      : item1.amount;
    return { year: item1.year, amount };
  });
};

// monthly arrs

export const calculateMonthlyTotals = (account, targetYear) => {
  if (account?.dealTransactions) {
    return account?.dealTransactions
      ?.filter((transaction: NexusGenRootTypes['DealTransaction']) => {
        const transactionDate = new Date(
          transaction?.customCreationDate ?? transaction.dueDate,
        );
        const startDate = new Date(`${targetYear}-01-01`);
        const endDate = new Date(`${parseInt(targetYear) + 1}-01-01`);
        return transactionDate >= startDate && transactionDate < endDate;
      })
      ?.reduce((totals, transaction: NexusGenFieldTypes['DealTransaction']) => {
        const month = new Date(
          transaction?.customCreationDate ?? transaction.dueDate,
        ).getMonth();
        const transactionOrder =
          transaction?.sellingOrder as NexusGenFieldTypes['Order'];

        const transactionTotal = transaction?.paid
          ? transaction?.paid -
            (transaction?.paid / (transactionOrder?.total || 1)) *
              (transactionOrder?.tax || 0)
          : 0;

        if (transaction?.status === 'Refunded') {
          totals[month] = (totals[month] || 0) - transactionTotal;
          return totals;
        } else {
          totals[month] = (totals[month] || 0) + transactionTotal;
          return totals;
        }
      }, {});
  } else {
    return [];
  }
};

export const createMonthlyArr = (monthlyTotals) => {
  return monthNames.map((month) => ({
    month,
    amount: monthlyTotals[monthNames.indexOf(month)] || 0,
  }));
};

export const calculateAndCreateMonthlyArr = (account, targetYear) => {
  const monthlyTotals = calculateMonthlyTotals(account, targetYear);
  return createMonthlyArr(monthlyTotals);
};
export const combineMonthlyArrays = (mainArray, subtractArray) => {
  return mainArray.map((item1) => {
    const matchingItem2 = subtractArray.find(
      (item2) => item2.month === item1.month,
    );
    const amount = matchingItem2
      ? item1.amount - matchingItem2.amount
      : item1.amount;
    return { month: item1.month, amount };
  });
};

export const addArraysByMonth = (array1, array2) => {
  if (array1.length !== array2.length) {
    throw new Error('Arrays must have the same length');
  }
  const resultArray = [];

  for (let i = 0; i < array1.length; i++) {
    const month = array1[i].month;
    const amount = array1[i].amount + array2[i].amount;
    resultArray.push({ month, amount });
  }

  return resultArray;
};

//common

export const calculateLastMonthlyTotals = (account) => {
  if (account?.dealTransactions) {
    return account?.dealTransactions?.reduce(
      (totals, transaction: NexusGenFieldTypes['DealTransaction']) => {
        const month = new Date(
          transaction?.customCreationDate ?? transaction.dueDate,
        ).getMonth();
        const transactionOrder =
          transaction?.sellingOrder as NexusGenFieldTypes['Order'];

        const transactionTotal = transaction?.paid
          ? transaction?.paid -
            (transaction?.paid / (transactionOrder?.total || 1)) *
              (transactionOrder?.tax || 0)
          : 0;

        if (transaction?.status === 'Refunded') {
          totals[month] = (totals[month] || 0) - transactionTotal;
          return totals;
        } else {
          totals[month] = (totals[month] || 0) + transactionTotal;
          return totals;
        }
      },
      {},
    );
  } else {
    return [];
  }
};

export const calculateAndCreateIncomeChartMonthlyArr = (account) => {
  const monthlyTotals = calculateLastMonthlyTotals(account);
  return createMonthlyArr(monthlyTotals);
};

//cardTotals

export function calculateTotalPaid(transactions): string {
  return transactions
    ?.reduce((summary, transaction) => {
      if (transaction?.status === 'Refunded') {
        return summary - transaction?.paid;
      } else {
        return summary + transaction?.paid;
      }
    }, 0)
    ?.toFixed(2);
}

export function calculateTotalPaidNumber(transactions): number {
  return Number(
    transactions
      ?.reduce((summary, transaction) => {
        if (transaction?.status === 'Refunded') {
          return summary - transaction?.paid;
        } else {
          return summary + transaction?.paid;
        }
      }, 0)
      ?.toFixed(2),
  );
}

export function calculateTotal(transactions): string {
  return transactions
    ?.reduce((summary, transaction) => {
      if (transaction?.status === 'Refunded') {
        return summary - transaction?.paid;
      } else {
        return summary + transaction?.paid;
      }
    }, 0)
    ?.toFixed(2);
}

export function calculateTotalNumber(transactions): number {
  return Number(
    transactions
      ?.reduce((summary, transaction) => {
        if (transaction?.status === 'Refunded') {
          return summary - transaction?.summary;
        } else {
          return summary + transaction?.summary;
        }
      }, 0)
      ?.toFixed(2),
  );
}

export function calculateTotalRevenue(transactions): string {
  return transactions
    ?.reduce((summary, transaction) => {
      const transactionTotal = transaction?.summary
        ? transaction.summary -
          (transaction.summary / (transaction?.sellingOrder?.total || 1)) *
            (transaction?.sellingOrder?.tax || 0)
        : 0;

      if (transaction?.status === 'Refunded') {
        return summary - transactionTotal;
      } else {
        return summary + transactionTotal;
      }
    }, 0)
    ?.toFixed(2);
}

export const getTotalPaid = (transactions) => {
  return transactions
    ?.reduce((paid, transaction) => paid + transaction?.paid, 0)
    ?.toFixed(2);
};

export const calculatePercentageChange = (
  previousValue: number | string,
  currentValue: number | string,
): number => {
  const prev =
    typeof previousValue === 'string'
      ? parseFloat(previousValue)
      : previousValue;
  const curr =
    typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;

  if (isNaN(prev) || isNaN(curr)) {
    return 0;
  }

  if (prev === 0) {
    return curr === 0 ? 0 : 100;
  }

  const percentageChange = ((curr - prev) / Math.abs(prev)) * 100;

  return isNaN(percentageChange) || !isFinite(percentageChange)
    ? 0
    : parseFloat(percentageChange.toFixed(2));
};

export const calculateSumOfDifferences = (transactions): string => {
  const differences = transactions.map(
    (transaction: NexusGenRootTypes['DealTransaction']) =>
      transaction?.summary - (transaction?.paid || 0),
  );
  return differences
    ?.reduce((acc, currentDifference) => acc + currentDifference, 0)
    ?.toFixed(2);
};

export const calculateSumOfDifferencesNumber = (transactions): number => {
  const differences = transactions.map(
    (transaction: NexusGenRootTypes['DealTransaction']) =>
      transaction?.summary - (transaction?.paid || 0),
  );
  return Number(
    differences
      ?.reduce((acc, currentDifference) => acc + currentDifference, 0)
      ?.toFixed(2),
  );
};

export const calculateUniqueProducts = (memoEvents): number => {
  const productNames = memoEvents.map(
    (event) => event?.productInventoryItem?.product?.name,
  );
  return new Set(productNames).size;
};

export const calculateTotalRemainingQuantity = (memoEvents): number => {
  return memoEvents.reduce(
    (sum, event) => sum + (event.remainingQuantity || 0),
    0,
  );
};

export const calculateMemoInEventsTotalValue = (memoEvents): number => {
  return memoEvents.reduce(
    (sum, event) =>
      sum + (event.remainingQuantity || 0) * (event.itemCost || 0),
    0,
  );
};

export const calculateAverageGrossMargin = (reportItems) => {
  if (reportItems.length === 0) {
    return 0;
  }

  const totalGrossMargin = reportItems.reduce(
    (sum, item) => sum + item.grossMargin,
    0,
  );
  const averageGrossMargin = totalGrossMargin / reportItems.length;

  return parseFloat(averageGrossMargin.toFixed(2));
};

export const calculateTotalItemCosts = (reportItems) => {
  if (reportItems.length === 0) {
    return 0;
  }

  return reportItems.reduce((sum, item) => sum + item.itemCost, 0).toFixed(2);
};

export const calculateItemsTotal = (items): string => {
  return items?.reduce((total, item) => total + item?.price, 0)?.toFixed(2);
};

export const calculateSalesItemCurrentPaidPreTaxSum = (
  salesItemReports,
): number => {
  const discountService = strapi.service('api::discount.discount');
  const taxService = strapi.service('api::tax.tax');

  return salesItemReports.reduce((total, report) => {
    const orderItem =
      report.productOrderItem ||
      report.compositeProductOrderItem ||
      report.serviceOrderItem ||
      report.membershipOrderItem ||
      report.classOrderItem;

    if (!orderItem) return total;

    const price = orderItem.price ?? 0;
    const quantity = orderItem.quantity ?? 1;
    const order = orderItem.order;
    const reportOrder = report.order;

    if (!order || !reportOrder || quantity <= 0) return total;

    const isPurchase = reportOrder.type === 'purchase';
    const paidSummary = (reportOrder?.dealTransactions ?? []).reduce(
      (total, transaction) => {
        const validTransaction =
          (isPurchase &&
            transaction?.chartAccount?.name === 'Cost of Goods Sold') ||
          (!isPurchase && transaction?.chartAccount?.name === 'Revenue');

        if (validTransaction && transaction?.paid) {
          if (transaction.status === 'Refunded') {
            total -= transaction.paid;
          } else {
            total += transaction.paid;
          }
        }

        return total;
      },
      0,
    );

    const discountAmountPerItem =
      discountService.getDiscountAmountSumForOrderItem(
        price,
        1,
        orderItem.discounts,
        order,
      );

    const itemValue = price - discountAmountPerItem;
    const preTaxSales =
      (order.total ?? 0) -
      (order.tip ?? 0) -
      (order.tax ?? 0) +
      (order.points ?? 0);
    const calculatedSubTotal =
      parseFloat(preTaxSales.toFixed(2)) || order.subTotal || 1;

    const pointsProportion =
      (itemValue * (order.points ?? 0)) / calculatedSubTotal;
    const adjustedPrice = itemValue - pointsProportion;

    const taxAmountPerItem = taxService.getTaxAmountPerItem(orderItem);

    const denominator = (order.total ?? 0) - (order.tip ?? 0);
    const currentPaid = parseFloat(
      denominator !== 0
        ? (
            (paidSummary / denominator) *
            (adjustedPrice + taxAmountPerItem)
          ).toFixed(2)
        : '0',
    );

    const currentPaidPreTax = currentPaid - taxAmountPerItem;

    return total + currentPaidPreTax;
  }, 0);
};

export const calculateMemoOutProductsAmount = (items): string => {
  return items?.length;
};

export const calculateMemoOutItemsTotal = (items): string => {
  return items
    ?.reduce((total, item) => total + (item.quantity || 0), 0)
    ?.toFixed(2);
};

export const calculateMemoOutItemsTotalValue = (items): number => {
  return items.reduce(
    (sum, event) => sum + (event.quantity || 0) * (event.price || 0),
    0,
  );
};

export const calculateAverageAge = (itemRecords) => {
  if (itemRecords.length === 0) {
    return 0;
  }

  const totalAge = itemRecords.reduce((sum, item) => sum + item.age, 0);
  const averageAge = totalAge / itemRecords.length;

  return parseFloat(averageAge.toFixed(2));
};

export const calculateItemRecordsTotalCostPrice = (itemRecords): number => {
  const uniqueRecords = itemRecords.filter(
    (item, index, self) =>
      item?.productInventoryItemEvent?.id &&
      index ===
        self.findIndex(
          (record) =>
            record?.productInventoryItemEvent?.id ===
            item?.productInventoryItemEvent?.id,
        ),
  );

  return uniqueRecords.reduce((total, itemRecord) => {
    return (
      total +
      itemRecord?.productInventoryItemEvent?.itemCost *
        itemRecord?.productInventoryItemEvent?.remainingQuantity
    );
  }, 0);
};

export const calculateItemRecordsTotalSalePrice = (itemRecords): number => {
  const uniqueRecords = itemRecords.filter(
    (item, index, self) =>
      item?.productInventoryItem?.id &&
      index ===
        self.findIndex(
          (record) =>
            record?.productInventoryItem?.id === item?.productInventoryItem?.id,
        ),
  );

  return uniqueRecords.reduce((total, itemRecord) => {
    const quantity = itemRecord?.productInventoryItem?.quantity ?? 0;
    if (quantity <= 0) return total;

    const inventoryItemPrice = itemRecord?.productInventoryItem?.price ?? 0;

    const productItemCost =
      itemRecord?.productInventoryItemEvent?.itemCost ?? 0;
    const productMultiplier =
      itemRecord?.productInventoryItem?.product?.multiplier ?? 0;
    const multipliedPrice = productItemCost * productMultiplier ?? 0;

    const productPrice =
      itemRecord?.productInventoryItem?.product?.defaultPrice ?? 0;

    const itemPrice = inventoryItemPrice || multipliedPrice || productPrice;

    return total + itemPrice * quantity;
  }, 0);
};

export const calculateProductInventoryItemsTotalSalePrice = (
  productInventoryItems,
): number => {
  return productInventoryItems.reduce((total, productInventoryItem) => {
    const quantity = productInventoryItem?.quantity ?? 0;
    if (quantity <= 0) return total;

    const inventoryItemPrice = productInventoryItem?.price ?? 0;

    const productItemCost =
      productInventoryItem?.product_inventory_item_events?.[0]?.itemCost ?? 0;
    const productMultiplier = productInventoryItem?.product?.multiplier ?? 0;
    const multipliedPrice = productItemCost * productMultiplier ?? 0;

    const productPrice = productInventoryItem?.product?.defaultPrice ?? 0;

    const itemPrice = inventoryItemPrice || multipliedPrice || productPrice;

    return total + itemPrice * quantity;
  }, 0);
};

// helpers for SELLING MODULE DASHBOARD---->
export const getPercentageDifference = (oldValue: number, newValue: number) => {
  if (oldValue === 0) {
    // Avoid division by zero
    return newValue === 0 ? 0 : newValue < 0 ? -100 : 100;
  }

  const percentageDifference =
    ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  return Math.ceil(percentageDifference);
};

export const getStartOfWeek = (date?: Date) => {
  const todayDate = date ? new Date(date) : new Date();

  return new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() - todayDate.getDay() + 1,
  );
};

export const getWeekRange = () => {
  const todayDate = new Date();

  todayDate.setUTCDate(todayDate.getUTCDate() - 7);

  return new Date(todayDate);
};

export const calculatePaidSummaryFromOrder = (order) => {
  if (order?.dealTransactions?.length) {
    const totalValue = order.dealTransactions.reduce((total, transaction) => {
      const isPurchase = order?.type === 'purchase';

      const validTransaction =
        (isPurchase &&
          transaction?.chartAccount?.name === 'Cost of Goods Sold') ||
        (!isPurchase && transaction?.chartAccount?.name === 'Revenue');

      if (validTransaction && transaction?.paid) {
        if (transaction?.status === 'Refunded') {
          total -= transaction.paid;
        } else {
          total += transaction.paid;
        }
      }
      return total;
    }, 0);

    return totalValue;
  }

  return 0;
};

export const calculateRefundedSummaryFromOrder = (order) => {
  if (order?.dealTransactions?.length) {
    const totalValue = order.dealTransactions.reduce((total, transaction) => {
      const isPurchase = order?.type === 'purchase';

      const validTransaction =
        (isPurchase &&
          transaction?.chartAccount?.name === 'Cost of Goods Sold') ||
        (!isPurchase && transaction?.chartAccount?.name === 'Revenue');

      if (validTransaction && transaction?.paid) {
        if (transaction?.status === 'Refunded') {
          total += transaction.paid;
        } else {
          return total;
        }
      }
      return total;
    }, 0);

    return totalValue;
  }

  return 0;
};

export const calculateRefundedSummaryFromTransactions = (transactions) => {
  if (transactions?.length) {
    return transactions.reduce((total, transaction) => {
      if (transaction?.paid && transaction?.status === 'Refunded') {
        return total + transaction.paid;
      }
      return total;
    }, 0);
  }

  return 0;
};

export const calculateOrdersAmountPaidPreTax = (orders) => {
  return orders?.reduce((total, order) => {
    const amountPaid = calculatePaidSummaryFromOrder(order);

    const totalValue = order?.total ?? 0;
    const tip = order?.tip ?? 0;
    const tax = order?.tax ?? 0;

    const preTaxSales = totalValue - tip - tax;
    const totalWithoutTip = totalValue - tip;

    if (totalWithoutTip === 0) return total;

    const amountPaidPreTax = (amountPaid / totalWithoutTip) * preTaxSales;
    return total + parseFloat(amountPaidPreTax.toFixed(2));
  }, 0);
};

export function calculateOrdersTotal(orders): number {
  return orders?.reduce(
    (total, order) => total + (order?.total - order?.tax),
    0,
  );
}

export function calculateOrdersSubTotal(orders): number {
  return orders?.reduce((total, order) => total + order?.subTotal, 0);
}

const calculateItemsSubtotal = (items): number => {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
};

const calculateItemsQuantity = (items): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export type DealTransactionCard = {
  id: number;
  name: string;
  total: number;
  cardImg: number;
  type: string;
};

export function calculateOrdersDealTransactionsData(
  orders,
): DealTransactionCard[] {
  const paymentMethodMap = new Map<
    string,
    { id: number; name: string; total: number }
  >();
  let nextId = 1000;

  for (const order of orders) {
    if (order?.dealTransactions && order.dealTransactions.length > 0) {
      for (const transaction of order.dealTransactions) {
        const paymentMethod = transaction?.paymentMethod;

        if (paymentMethod) {
          const formattedPaymentMethod = startCase(
            toLower(paymentMethod?.name),
          );
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
    }
  }

  const transactionsArray = Array.from(paymentMethodMap.values());

  return transactionsArray.map((entry, index) => ({
    ...entry,
    cardImg: [1, 2, 3, 2][index % 4],
    type: 'transactions',
  }));
}

const calculateItemsSubtotalWithDiscount = (
  items: any[],
  order: any,
  discountServices: any,
): number => {
  return items.reduce((total, item) => {
    const discountAmountPerItem =
      discountServices.getDiscountAmountSumForOrderItem(
        item.price,
        1,
        item.discounts,
        order,
      );
    const itemPriceWithoutDiscount = item.price - discountAmountPerItem;
    return total + itemPriceWithoutDiscount * item.quantity;
  }, 0);
};

export function calculateOrdersData(orders): {
  ordersTotal: number;
  ordersSubTotal: number;
  productsPortion: number;
  compositeProductsPortion: number;
  servicesPortion: number;
  layawayOrdersTotal: number;
  ordersTaxTotal: number;
  numberOfOrders: number;
  numberOfItemsSold: number;
  averageOrderTotal: number;
  numberOfOrderCustomers: number;
  averageGrossMargin: number;
  averageProductsGrossMargin: number;
  dailySummaryDealTransactionsCards: DealTransactionCard[];
  itemAverageRevenue: number;
  refundedTransactionsSummary: number;
} {
  const discountServices = strapi.service('api::discount.discount');

  let ordersTotal = 0;
  let ordersSubTotal = 0;
  let productsPortion = 0;
  let compositeProductsPortion = 0;
  let servicesPortion = 0;
  let layawayOrdersTotal = 0;
  let ordersTaxTotal = 0;
  let numberOfOrders = 0;
  let numberOfItemsSold = 0;
  let averageOrderTotal = 0;
  let averageGrossMargin = 0;
  let averageProductsGrossMargin = 0;
  let dailySummaryDealTransactionsCards: DealTransactionCard[] = [];
  let itemAverageRevenue = 0;

  const contactsArray = [];
  const companiesArray = [];

  let totalGrossMargin = 0;
  let validGrossMarginOrders = 0;
  let totalProductsGrossMargin = 0;
  let validProductsGrossMarginOrders = 0;

  let refundedTransactionsSummary = 0;

  for (const order of orders) {
    if (order?.products && order.products.length > 0) {
      const filteredProducts = order.products.filter(
        (product) => product.isCompositeProductItem !== true,
      );
      if (filteredProducts.length > 0) {
        productsPortion += calculateItemsSubtotalWithDiscount(
          filteredProducts,
          order,
          discountServices,
        );
        numberOfItemsSold += calculateItemsQuantity(filteredProducts);
      }
    }

    if (order?.compositeProducts && order.compositeProducts.length > 0) {
      compositeProductsPortion += calculateItemsSubtotalWithDiscount(
        order.compositeProducts,
        order,
        discountServices,
      );
      numberOfItemsSold += calculateItemsQuantity(order.compositeProducts);
    }

    if (order?.services && order.services.length > 0) {
      servicesPortion += calculateItemsSubtotalWithDiscount(
        order.services,
        order,
        discountServices,
      );
      numberOfItemsSold += calculateItemsQuantity(order.services);
    }

    if (order?.memberships && order.memberships.length > 0) {
      numberOfItemsSold += calculateItemsQuantity(order.memberships);
    }

    if (order?.classes && order.classes.length > 0) {
      numberOfItemsSold += calculateItemsQuantity(order.classes);
    }

    if (order?.type === 'layaway') {
      layawayOrdersTotal += order?.total - order?.tax;
    }

    if (order?.tax) {
      ordersTaxTotal += order?.tax;
    }

    if (order?.contact?.id && !contactsArray.includes(order.contact.id)) {
      contactsArray.push(order.contact.id);
    }

    if (order?.company?.id && !companiesArray.includes(order.company.id)) {
      companiesArray.push(order.company.id);
    }

    if (order?.salesItemReports && order.salesItemReports.length > 0) {
      const orderGrossMargin = calculateAverageGrossMargin(
        order.salesItemReports,
      );
      const orderProductGrossMargin = calculateAverageGrossMargin(
        order.salesItemReports.filter(
          (salesItemReport) => salesItemReport?.type === 'product',
        ),
      );

      if (orderGrossMargin > 0) {
        totalGrossMargin += orderGrossMargin;
        validGrossMarginOrders++;
      }

      if (orderProductGrossMargin > 0) {
        totalProductsGrossMargin += orderProductGrossMargin;
        validProductsGrossMarginOrders++;
      }
    }

    refundedTransactionsSummary += calculateRefundedSummaryFromOrder(order);
  }

  if (orders && orders?.length > 0) {
    ordersTotal = calculateOrdersTotal(orders);
    ordersSubTotal = calculateOrdersSubTotal(orders);
    numberOfOrders = orders?.length;

    if (ordersTotal && numberOfOrders) {
      averageOrderTotal = ordersTotal / numberOfOrders;
    }

    if (ordersSubTotal && numberOfItemsSold) {
      itemAverageRevenue = ordersSubTotal / numberOfItemsSold;
    }

    dailySummaryDealTransactionsCards =
      calculateOrdersDealTransactionsData(orders);
  }

  if (validGrossMarginOrders > 0) {
    averageGrossMargin = totalGrossMargin / validGrossMarginOrders;
  }

  if (validProductsGrossMarginOrders > 0) {
    averageProductsGrossMargin =
      totalProductsGrossMargin / validProductsGrossMarginOrders;
  }

  const numberOfOrderContacts = contactsArray.length;
  const numberOfOrderCompanies = companiesArray.length;
  const numberOfOrderCustomers = numberOfOrderContacts + numberOfOrderCompanies;

  return {
    ordersTotal,
    ordersSubTotal,
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
    itemAverageRevenue,
    refundedTransactionsSummary,
  };
}

export function calculateAverageOrderItemPrice(salesItemReports): string {
  if (!salesItemReports?.length) {
    return (0).toFixed(2);
  }

  return (
    salesItemReports?.reduce(
      (total, salesItemReport) => total + salesItemReport?.price,
      0,
    ) / salesItemReports?.length
  )?.toFixed(2);
}

export const filterPeriodBuilder = (
  startDate,
  endDate,
  filterAttribute = 'createdAt',
) => {
  if (startDate && endDate) {
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);
    return {
      [filterAttribute]: {
        $between: [startDateObject.toISOString(), endDateObject.toISOString()],
      },
    };
  }
  return {
    [filterAttribute]: {
      $between: [getStartOfWeek().toISOString(), currentDate.toISOString()],
    },
  };
};

export const getUserWithTenant = async (userId) => {
  const userService = strapi.plugin('users-permissions').service('user');

  const user = await userService.fetch(userId, {
    fields: ['id'],
    populate: {
      tenant: {
        fields: ['id', 'slug'],
      },
    },
  });

  return user;
};

export const getTenantFilter = async (userId, isFullTenantInfo = false) => {
  const user = await getUserWithTenant(userId);
  const tenantId = user?.tenant?.id;

  return {
    tenant: tenantId,
    ...(isFullTenantInfo ? { tenantFullInfo: user?.tenant } : {}),
  };
};

export const getLocationFilter = (locationId) => {
  return locationId
    ? {
        businessLocation: {
          id: {
            $eq: locationId,
          },
        },
      }
    : {};
};

export const formatNumber = (
  value?: number | null,
  additionalOptions?: Intl.NumberFormatOptions,
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...additionalOptions,
  }).format(value || 0);
};

export const formatToCurrency = (value?: number | null): string => {
  return formatNumber(value, { currency: 'USD', style: 'currency' });
};

interface TransformedCardInfo {
  name: string;
  imgLink: string;
  total?: string | number;
}

export const cardsInfoTransform = (cardsInfo) => {
  const resultArr: TransformedCardInfo[] = [];
  cardsInfo.forEach((el) => {
    const obj: TransformedCardInfo = {
      name: el.name,
      imgLink: '',
    };
    if (el.type === 'transactions') {
      obj.total = formatToCurrency(el.total);
    } else {
      obj.total = el.total;
    }
    switch (el.cardImg) {
      case 1:
        obj.imgLink =
          'https://bn-dev.fra1.digitaloceanspaces.com/app/vertical-saas/uploads/Screenshot_2024_05_03_at_23_05_25_2cee2c7db6.png';
        break;
      case 2:
        obj.imgLink =
          'https://bn-dev.fra1.digitaloceanspaces.com/app/vertical-saas/uploads/Screenshot_2024_05_03_at_23_09_32_62e8145921.png';
        break;
      case 3:
        obj.imgLink =
          'https://bn-dev.fra1.digitaloceanspaces.com/app/vertical-saas/uploads/Screenshot_2024_05_03_at_23_15_29_bcafa191b8.png';
        break;
      default:
        obj.imgLink =
          'https://bn-dev.fra1.digitaloceanspaces.com/app/vertical-saas/uploads/Screenshot_2024_05_03_at_23_05_25_2cee2c7db6.png';
        break;
    }
    resultArr.push(obj);
  });
  return resultArr;
};

export const buildInventoryReportFilters = async (
  userId,
  additionalFilters = {},
) => {
  const productFilter = addDollarToFilterKeys(additionalFilters);

  const { productInventoryItems, ...productFilters } = productFilter;

  const productInventoryItemFilter = {
    product: {
      ...productFilters,
    },
    ...productInventoryItems,
  };

  const productInventoryItemEventFilter = {
    productInventoryItem: {
      product: {
        ...productFilters,
      },
      ...productInventoryItems,
    },
  };

  const tenantFilter = await getTenantFilter(userId);

  return {
    tenantFilter,
    productFilter,
    productInventoryItemFilter,
    productInventoryItemEventFilter,
  };
};

export const beginningOfYesterdayUtc = (() => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
})();

export const endOfTomorrowUtc = (() => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
})();
