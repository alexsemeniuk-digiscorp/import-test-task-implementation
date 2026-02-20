import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  memoInExportDataPopulation,
  memoInExportDataProductFields,
} from './variables';

export const memoStatus = (data): string => {
  let status = '-';

  if (data) {
    const {
      expiryDate,
      change,
      remainingQuantity,
      isFullyReturned,
      isPartiallyReturned,
    } = data;

    const isDateExpired = expiryDate && new Date(expiryDate) < new Date();
    const isSold =
      Number(remainingQuantity) === 0 &&
      !isFullyReturned &&
      !isPartiallyReturned;
    const isReturnedSelected =
      Number(remainingQuantity) === 0 && isFullyReturned;
    const isPartiallyReturnedSelected =
      Number(remainingQuantity) >= 0 && isPartiallyReturned;
    const isOnSale =
      Number(remainingQuantity) === Number(change) && !isDateExpired;
    const isPartialSold =
      Number(remainingQuantity) > 0 &&
      Number(remainingQuantity) < Number(change) &&
      !isDateExpired;
    const isPartialExpired =
      Number(remainingQuantity) > 0 &&
      Number(remainingQuantity) < Number(change) &&
      isDateExpired;
    const isFullyExpired =
      Number(remainingQuantity) === Number(change) && isDateExpired;

    if (isSold) {
      status = 'Sold';
    } else if (isReturnedSelected) {
      status = 'Returned';
    } else if (isPartiallyReturnedSelected) {
      status = 'Partially Returned';
    } else if (isOnSale) {
      status = 'On Sale';
    } else if (isPartialSold) {
      status = 'Partially Sold';
    } else if (isPartialExpired) {
      status = 'Partially Expired';
    } else if (isFullyExpired) {
      status = 'Expired';
    }

    return status;
  } else {
    return status;
  }
};

// csv helpers
export const getMemoInReportCSVHeaders = (): string[][] => {
  const csvHeaders = [
    [
      'PURCHASE ORDER',
      'PRODUCT NAME',
      'LOCATION',
      'SKU',
      'VENDOR',
      'UNIT PRICE',
      'QUANTITY ON HAND',
      'RECEIVE DATE',
      'EXPIRY DATE',
      'STATUS',
      'PARTIALLY RETURNED',
      'FULLY RETURNED',
      'NOTIFIED',
      'MEMO NUMBER',
      'NOTE',
      'DATE RETURNED',
    ],
  ];

  return csvHeaders;
};

export const getMemoInReportCSVData = (
  event,
  dateFormat,
  timeFormat,
): string[] => {
  const receiveDateString = event?.receiveDate
    ? formatDateAndTime(event?.receiveDate, dateFormat, timeFormat)
    : '';
  const expiryDateString = event?.expiryDate
    ? formatDateAndTime(event?.expiryDate, dateFormat, timeFormat)
    : '';
  const returnedDateString = event?.returnedDate
    ? formatDateAndTime(event?.returnedDate, dateFormat, timeFormat)
    : '';

  const itemArr = [
    event?.order?.orderId ?? '',
    escapeCsvField(event?.productInventoryItem?.product?.name ?? ''),
    escapeCsvField(event?.productInventoryItem?.businessLocation?.name ?? ''),
    escapeCsvField(event?.productInventoryItem?.product?.SKU ?? ''),
    escapeCsvField(
      event?.itemVendor?.name ?? event?.itemContactVendor?.fullName ?? '',
    ),
    event?.itemCost ?? 0,
    escapeCsvField(
      `${event?.remainingQuantity} out of ${Number(event?.change)}` ?? '',
    ),
    receiveDateString,
    expiryDateString,
    memoStatus(event) ?? '',
    event?.isPartiallyReturned ? 'Yes' : 'No',
    event?.isFullyReturned ? 'Yes' : 'No',
    event?.isNotified ? 'Yes' : 'No',
    escapeCsvField(event?.order?.memoNumber ?? event?.memoNumber ?? ''),
    escapeCsvField(event?.note ?? ''),
    returnedDateString,
  ];

  return itemArr;
};

export const getMemoInReportCSVString = async (events, userId) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getMemoInReportCSVHeaders()[0];
  const rows = events.map((event) =>
    getMemoInReportCSVData(event, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateMemoInReportData = async (job) => {
  const productMemoInEvents = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        ...job?.data?.tenantFilter,
        ...job?.data?.reportFilter,
      },
      sort: ['createdAt:desc'],
      pagination: { limit: -1 },
      fields: memoInExportDataProductFields as any,
      populate: memoInExportDataPopulation as any,
    },
  );

  return productMemoInEvents;
};

export const generateMemoInReportCSV = async (job) => {
  const productMemoInEvents = await generateMemoInReportData(job);

  return getMemoInReportCSVString(productMemoInEvents, job?.data?.userId);
};
