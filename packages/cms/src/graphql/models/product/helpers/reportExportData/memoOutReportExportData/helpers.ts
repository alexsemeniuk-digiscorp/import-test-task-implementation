import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  MemoOutReportWithOrder,
  memoOutExportDataPopulation,
  memoOutExportDataProductFields,
} from './variables';

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

export const memoOutExportStatus = (data): string => {
  let status = '-';

  if (data) {
    const { order, quantity, isFullyReturned, isPartiallyReturned } = data;
    const orderCreationDate = order?.createdAt;
    const createdAtDate = orderCreationDate
      ? new Date(orderCreationDate)
      : null;
    const memoDays = order?.memo ? Number(order?.memo) : 0;
    const memoExpiryDate = createdAtDate
      ? new Date(createdAtDate.setDate(createdAtDate.getDate() + memoDays))
      : null;
    const amountPaid = order?.paidSummary;
    const orderTotal = order?.total;

    const isReturnedSelected = Number(quantity) === 0 && isFullyReturned;
    const isPartiallyReturnedSelected =
      Number(quantity) >= 0 && isPartiallyReturned;
    const isDateExpired = !!(memoExpiryDate && memoExpiryDate < new Date());
    const isExpired = Number(amountPaid) === 0 && isDateExpired;
    const isPartiallyPaid =
      Number(amountPaid) > 0 &&
      Number(amountPaid) < Number(orderTotal) &&
      isDateExpired;
    const isPaid = Number(amountPaid) >= Number(orderTotal) && isDateExpired;

    if (isReturnedSelected) {
      status = 'Returned';
    } else if (isPartiallyReturnedSelected) {
      status = 'Partially Returned';
    } else if (!isDateExpired) {
      status = 'On Sale';
    } else if (isExpired) {
      status = 'Expired';
    } else if (isPartiallyPaid) {
      status = 'Partially Paid';
    } else if (isPaid) {
      status = 'Paid';
    }

    return status;
  } else {
    return status;
  }
};

// csv helpers
export const getMemoOutReportCSVHeaders = (): string[][] => {
  const csvHeaders = [
    [
      'SALES ORDER',
      'PRODUCT NAME',
      'CUSTOMER',
      'SKU',
      'UNIT PRICE',
      'QUANTITY OUT',
      'SENT DATE',
      'EXPIRY DATE',
      'STATUS',
      'PARTIALLY RETURNED',
      'FULLY RETURNED',
      'NOTE',
      'DATE RETURNED',
    ],
  ];

  return csvHeaders;
};

export const getMemoOutReportCSVData = (
  product,
  dateFormat,
  timeFormat,
): string[] => {
  const createdAtString = product?.order?.createdAt
    ? formatDateAndTime(product?.order?.createdAt, dateFormat, timeFormat)
    : '';
  const expiryDateString = product?.order?.expiryDate
    ? formatDateAndTime(product?.order?.expiryDate, dateFormat, timeFormat)
    : '';
  const returnedDateString = product?.returnedDate
    ? formatDateAndTime(product?.returnedDate, dateFormat, timeFormat)
    : '';

  const itemArr = [
    product?.order?.orderId ?? '',
    escapeCsvField(product?.product?.product?.name ?? ''),
    escapeCsvField(
      product?.order?.contact?.fullName ?? product?.order?.company?.name ?? '',
    ),
    escapeCsvField(product?.product?.product?.SKU ?? ''),
    String(product?.price) ?? '',
    escapeCsvField(`${product?.quantity} out of ${product?.quantity}` ?? ''),
    createdAtString,
    expiryDateString,
    memoOutExportStatus(product) ?? '',
    product?.isPartiallyReturned ? 'Yes' : 'No',
    product?.isFullyReturned ? 'Yes' : 'No',
    escapeCsvField(product?.reportNote ?? ''),
    returnedDateString,
  ];

  return itemArr;
};

export const getMemoOutReportCSVString = async (products, userId) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getMemoOutReportCSVHeaders()[0];
  const rows = products.map((product) =>
    getMemoOutReportCSVData(product, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateMemoOutReportData = async (job) => {
  const productOrderItems = await strapi.entityService.findMany(
    'api::product-order-item.product-order-item',
    {
      filters: {
        ...job?.data?.reportFilter,
      },
      sort: ['createdAt:desc'],
      pagination: { limit: -1 },
      fields: memoOutExportDataProductFields as any,
      populate: memoOutExportDataPopulation as any,
    },
  );

  const extendedProductOrderItems = [];

  for (const productOrderItem of productOrderItems) {
    const order = (productOrderItem as MemoOutReportWithOrder)?.order;
    const paidSummary = getPaidSummaryFromOrder(order);

    extendedProductOrderItems.push({
      ...productOrderItem,
      order: {
        ...order,
        paidSummary,
      },
    });
  }

  return extendedProductOrderItems;
};

export const generateMemoOutReportCSV = async (job) => {
  const extendedProductOrderItems = await generateMemoOutReportData(job);

  return getMemoOutReportCSVString(
    extendedProductOrderItems,
    job?.data?.userId,
  );
};
