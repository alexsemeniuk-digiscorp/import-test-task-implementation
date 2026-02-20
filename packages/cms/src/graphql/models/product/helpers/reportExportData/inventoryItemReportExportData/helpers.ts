import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { formatToPercentage } from '../../../../../helpers/formatter';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  inventoryItemReportExportDataPopulation,
  inventoryItemReportExportDataProductFields,
} from './variables';

const getOnOrderAmount = (
  inventoryItemRecord,
  businessLocationId?: string,
): number => {
  const productInventoryItems =
    inventoryItemRecord?.productInventoryItem?.product?.productInventoryItems ??
    [];

  if (!productInventoryItems.length) return 0;

  return productInventoryItems.reduce((total, inventoryItem) => {
    if (
      businessLocationId &&
      inventoryItem?.businessLocation?.id?.toString() !==
        businessLocationId?.toString()
    ) {
      return total;
    }

    const orderItems = inventoryItem?.productOrderItems ?? [];

    const validOrderItemsSum = orderItems.reduce((sum, orderItem) => {
      const order = orderItem?.order;
      if (order?.type === 'purchase' && order?.status === 'placed') {
        return sum + (orderItem?.quantity ?? 0);
      }
      return sum;
    }, 0);

    return total + validOrderItemsSum;
  }, 0);
};

// csv helpers
export const getInventoryItemReportCSVHeaders = (): string[][] => {
  const csvHeaders = [
    [
      'BARCODE ID',
      'PRODUCT NAME',
      'SKU',
      'PRICE',
      'ITEM COST',
      'GROSS MARGIN',
      'DAYS IN INVENTORY',
      'ITEM VENDOR',
      'QUANTITY',
      'ON ORDER',
      'PURCHASE ORDER',
      'SELLING ORDER',
      'SOLD DATE',
      'CUSTOMER',
      'TAKEN MEMO',
      'SOLD MEMO',
      'MEMO NUMBER',
    ],
  ];

  return csvHeaders;
};

export const getInventoryReportCSVData = (
  inventoryItemRecord,
  dateFormat,
  timeFormat,
): string[] => {
  const itemVendorName =
    inventoryItemRecord?.productInventoryItemEvent?.itemVendor?.name ||
    inventoryItemRecord?.productInventoryItemEvent?.itemContactVendor
      ?.fullName ||
    '';
  const soldDateString = inventoryItemRecord?.sellingOrder?.customCreationDate
    ? formatDateAndTime(
        inventoryItemRecord?.sellingOrder?.customCreationDate,
        dateFormat,
        timeFormat,
      )
    : '';
  const customerName =
    inventoryItemRecord?.sellingOrder?.contact?.fullName ??
    inventoryItemRecord?.sellingOrder?.company?.name ??
    '';

  const itemArr = [
    escapeCsvField(
      inventoryItemRecord?.productInventoryItem?.product?.barcode ?? '',
    ),
    escapeCsvField(
      inventoryItemRecord?.productInventoryItem?.product?.name ?? '',
    ),
    escapeCsvField(
      inventoryItemRecord?.productInventoryItem?.product?.SKU ?? '',
    ),
    inventoryItemRecord?.price?.toString() ?? '',
    inventoryItemRecord?.productInventoryItemEvent?.itemCost?.toString() ?? '',
    formatToPercentage(inventoryItemRecord?.grossMargin),
    inventoryItemRecord?.age?.toString() ?? '',
    escapeCsvField(itemVendorName ?? ''),
    inventoryItemRecord?.soldDate ? '0' : '1',
    inventoryItemRecord?.onOrder?.toString() ?? '',
    inventoryItemRecord?.productInventoryItemEvent?.order?.orderId ?? '',
    inventoryItemRecord?.sellingOrder?.orderId ?? '',
    soldDateString,
    escapeCsvField(customerName),
    inventoryItemRecord?.memoTaken ? 'Yes' : 'No',
    inventoryItemRecord?.memoSold ? 'Yes' : 'No',
    escapeCsvField(
      inventoryItemRecord?.productInventoryItemEvent?.order?.memoNumber ??
        inventoryItemRecord?.productInventoryItemEvent?.memoNumber ??
        '',
    ),
  ];

  return itemArr;
};

export const getInventoryItemReportCSVString = async (
  inventoryItemRecords,
  userId,
) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getInventoryItemReportCSVHeaders()[0];
  const rows = inventoryItemRecords.map((inventoryItemRecord) =>
    getInventoryReportCSVData(inventoryItemRecord, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateInventoryItemReportData = async (job) => {
  const productRecords = await strapi.entityService.findMany(
    'api::invt-itm-record.invt-itm-record',
    {
      filters: {
        ...job?.data?.tenantFilter,
        ...job?.data?.reportFilter,
      },
      sort: ['createdAt:desc'],
      pagination: { limit: -1 },
      fields: inventoryItemReportExportDataProductFields as any,
      populate: inventoryItemReportExportDataPopulation as any,
    },
  );

  const businessLocationId =
    job?.data?.reportFilter?.productInventoryItem?.businessLocation?.id?.[
      '$in'
    ];

  const extendedProductRecords = [];

  for (const productRecord of productRecords) {
    const onOrder = getOnOrderAmount(productRecord, businessLocationId);

    extendedProductRecords.push({
      ...productRecord,
      onOrder,
    });
  }

  return extendedProductRecords;
};

export const generateInventoryItemReportCSV = async (job) => {
  const productRecords = await generateInventoryItemReportData(job);

  return getInventoryItemReportCSVString(productRecords, job?.data?.userId);
};
