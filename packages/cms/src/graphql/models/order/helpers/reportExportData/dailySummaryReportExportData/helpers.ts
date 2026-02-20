import capitalize from 'lodash/capitalize';
import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { formatToPercentage } from '../../../../../helpers/formatter';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  DailySummaryReportWithSales,
  dailySummaryReportExportDataOrderFields,
  dailySummaryReportExportDataPopulation,
} from './variables';

const calculateSubtotal = (items): number => {
  return items
    .reduce((total, item) => total + item.quantity * item.price, 0)
    .toFixed(2);
};

export const getSalesFullNameFromOrder = (
  order: DailySummaryReportWithSales,
): string => {
  return (
    [order.sales?.firstName, order.sales?.lastName].filter(Boolean).join(' ') ||
    ''
  );
};

export const getPaidSummaryFromOrder = (order): number => {
  if (!order?.dealTransactions?.length) return 0;

  const filteredTransactions = order.dealTransactions.filter((transaction) => {
    const validChartAccount =
      transaction?.chartAccount?.name === 'Revenue' ||
      transaction?.chartAccount?.name === 'Cost of Goods Sold';

    const validStatus =
      transaction?.status !== 'Cancelled' && transaction?.status !== 'Running';

    return validChartAccount && validStatus;
  });

  const totalValue = filteredTransactions.reduce((total, transaction) => {
    const isPurchase = order.type === 'purchase';
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
};

export const getPreTaxSales = (order): number => {
  const total = order?.total ?? 0;
  const tip = order?.tip ?? 0;
  const tax = order?.tax ?? 0;

  const preTaxSales = total - tip - tax;
  return parseFloat(preTaxSales.toFixed(2));
};

export const getAmountPaidPreTax = (order): number => {
  const amountPaid = getPaidSummaryFromOrder(order);

  const total = order?.total ?? 0;
  const tip = order?.tip ?? 0;
  const tax = order?.tax ?? 0;

  const preTaxSales = total - tip - tax;
  const totalWithoutTip = total - tip;

  if (totalWithoutTip === 0) return 0;

  const amountPaidPreTax = (amountPaid / totalWithoutTip) * preTaxSales;
  return parseFloat(amountPaidPreTax.toFixed(2));
};

export const getProductsPortionFromOrder = (order): number => {
  if (order?.products && order?.products?.length > 0) {
    const filteredProducts = order?.products?.filter(
      (product) => product?.isCompositeProductItem !== true,
    );

    if (filteredProducts?.length > 0) {
      return calculateSubtotal(filteredProducts);
    }
  }

  return 0;
};

export const getCompositeProductsPortionFromOrder = (order): number => {
  if (order?.compositeProducts && order?.compositeProducts?.length > 0) {
    return calculateSubtotal(order?.compositeProducts);
  }

  return 0;
};

export const getServicesPortionFromOrder = (order): number => {
  if (order?.services && order?.services?.length > 0) {
    return calculateSubtotal(order?.services);
  }

  return 0;
};

export const getItemsAmountFromOrder = (order): number => {
  let orderItemsAmount = 0;

  const reduceQuantity = (items) =>
    items?.reduce((total, item) => total + item?.quantity, 0);

  if (order?.products && order?.products?.length > 0) {
    orderItemsAmount += reduceQuantity(order.products);
  }

  if (order.compositeProducts && order.compositeProducts.length > 0) {
    orderItemsAmount += reduceQuantity(order.compositeProducts);
  }

  if (order.services && order.services.length > 0) {
    orderItemsAmount += reduceQuantity(order.services);
  }

  if (order.memberships && order.memberships.length > 0) {
    orderItemsAmount += reduceQuantity(order.memberships);
  }

  if (order.classes && order.classes.length > 0) {
    orderItemsAmount += reduceQuantity(order.classes);
  }

  return orderItemsAmount;
};

export const calculateDailySummaryExportOrderAverageGrossMargin = (
  order,
): number | null => {
  const grossMargins = (order?.salesItemReports ?? [])
    .map((report) => report?.grossMargin)
    .filter(
      (grossMargin): grossMargin is number =>
        typeof grossMargin === 'number' && grossMargin > 0,
    );

  return grossMargins.length > 0
    ? grossMargins.reduce((acc, margin) => acc + margin, 0) /
        grossMargins.length
    : null;
};

// csv helpers
export const getDailySummaryReportCSVHeaders = (
  extraColumns: string[],
): string[][] => {
  const csvHeaders = [
    [
      'ORDER ID',
      'ECOMMERCE',
      'ORDER STATUS',
      'CUSTOMER',
      'EMPLOYEE',
      'TOTAL PRICE',
      'PRE TAX SALES',
      'AMOUNT PAID',
      'AMOUNT PAID PRE TAX',
      'PRODUCTS PORTION',
      'COMPOSITE PRODUCTS PORTION',
      'SERVICES PORTION',
      'TAX',
      'TIP',
      'GROSS MARGIN',
      'SOLD DATE',
      'DUE DATE',
      'LOCATION',
      'SHIPPED DATE',
    ],
  ];

  if (!extraColumns?.length) {
    return csvHeaders;
  }

  if (extraColumns.includes('ordersNumber')) {
    csvHeaders[0]?.push('ITEMS COUNT');
  }

  if (extraColumns.includes('type')) {
    csvHeaders[0]?.push('ORDER TYPE');
  }

  return csvHeaders;
};

export const getDailySummaryReportCSVData = (
  order,
  extraColumns: string[],
  dateFormat,
  timeFormat,
): string[] => {
  const soldDateString = order?.customCreationDate
    ? formatDateAndTime(order?.customCreationDate, dateFormat, timeFormat)
    : '';
  const dueDateString = order?.dueDate
    ? formatDateAndTime(order?.dueDate, dateFormat, timeFormat)
    : '';
  const shippedDateString = order?.shippedDate
    ? formatDateAndTime(order?.shippedDate, dateFormat, timeFormat)
    : '';

  const itemArr = [
    order?.orderId?.toString() ?? '',
    order?.ecommerceType ? 'Yes' : 'No',
    capitalize(order?.status?.toString()) ?? '',
    escapeCsvField(order?.company?.name ?? order?.contact?.fullName ?? ''),
    escapeCsvField(order?.sales?.fullName ?? ''),
    order?.total?.toString() ?? '',
    order?.preTaxSales?.toString() ?? '',
    order?.paidSummary?.toString() ?? '',
    order?.amountPaidPreTax?.toString() ?? '',
    order?.productsPortion?.toString() ?? '',
    order?.compositeProductsPortion?.toString() ?? '',
    order?.servicesPortion?.toString() ?? '',
    order?.tax?.toString() ?? '',
    order?.tip?.toString() ?? '',
    formatToPercentage(
      calculateDailySummaryExportOrderAverageGrossMargin(order),
    ),
    soldDateString,
    dueDateString,
    escapeCsvField(order?.businessLocation?.name?.toString() ?? ''),
    shippedDateString,
  ];

  if (!extraColumns?.length) {
    return itemArr;
  }

  if (extraColumns?.includes('ordersNumber')) {
    itemArr.push(order?.itemsAmount?.toString() ?? '');
  }

  if (extraColumns?.includes('type')) {
    itemArr.push(order?.type?.toString() ?? '');
  }

  return itemArr;
};

export const getDailySummaryReportCSVString = async (
  orders,
  extraColumns: string[],
  userId,
) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getDailySummaryReportCSVHeaders(extraColumns)[0];
  const rows = orders.map((order) =>
    getDailySummaryReportCSVData(order, extraColumns, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateDailySummaryReportData = async (job) => {
  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      ...job?.data?.tenantFilter,
      ...job?.data?.reportFilter,
    },
    sort: ['customCreationDate:desc'],
    pagination: { limit: -1 },
    fields: dailySummaryReportExportDataOrderFields as any,
    populate: dailySummaryReportExportDataPopulation as any,
  });

  const extendedOrders = [];

  for (const order of orders) {
    const fullName = getSalesFullNameFromOrder(order);
    const paidSummary = getPaidSummaryFromOrder(order);
    const productsPortion = getProductsPortionFromOrder(order);
    const compositeProductsPortion =
      getCompositeProductsPortionFromOrder(order);
    const servicesPortion = getServicesPortionFromOrder(order);
    const itemsAmount = getItemsAmountFromOrder(order);
    const preTaxSales = getPreTaxSales(order);
    const amountPaidPreTax = getAmountPaidPreTax(order);

    extendedOrders.push({
      ...order,
      sales: {
        fullName,
      },
      paidSummary,
      productsPortion,
      compositeProductsPortion,
      servicesPortion,
      itemsAmount,
      preTaxSales,
      amountPaidPreTax,
    });
  }

  return extendedOrders;
};

export const generateDailySummaryReportCSV = async (job) => {
  const extendedOrders = await generateDailySummaryReportData(job);

  return getDailySummaryReportCSVString(
    extendedOrders,
    job?.data?.extraColumns,
    job?.data?.userId,
  );
};
