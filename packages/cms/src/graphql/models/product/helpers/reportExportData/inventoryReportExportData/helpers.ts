import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { formatToPercentage } from '../../../../../helpers/formatter';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  inventoryReportExportDataPopulation,
  inventoryReportExportDataProductFields,
} from './variables';

export const getQuantityFromProduct = (
  product,
  businessLocationId?: string,
  sublocationId?: string,
): number => {
  const items = product?.productInventoryItems || [];

  if (sublocationId) {
    const totalQuantity = items?.reduce(
      (acc: number, productInventoryItem: any) => {
        const sublocationItems = productInventoryItem?.sublocationItems || [];

        const sublocationSum = sublocationItems
          .filter(
            (sublocationItem) =>
              sublocationItem?.sublocation?.id === Number(sublocationId),
          )
          .reduce(
            (acc: number, sublocationItem) =>
              acc + (sublocationItem?.quantity || 0),
            0,
          );

        return acc + sublocationSum;
      },
      0,
    );

    return totalQuantity;
  } else {
    return items.reduce((totalQuantity, item) => {
      if (
        businessLocationId &&
        item?.businessLocation?.id?.toString() !==
          businessLocationId?.toString()
      ) {
        return totalQuantity;
      }

      return totalQuantity + (item?.quantity || 0);
    }, 0);
  }
};

export const getQuantitySoldFromProduct = (
  product,
  businessLocationId?: string,
): number => {
  if (!product?.productInventoryItems?.length) return 0;

  return product.productInventoryItems.reduce((total, inventoryItem) => {
    if (
      businessLocationId &&
      inventoryItem?.businessLocation?.id?.toString() !==
        businessLocationId?.toString()
    ) {
      return total;
    }

    const soldQuantity =
      inventoryItem.productOrderItems?.reduce((sum, item) => {
        const isSellOrLayaway =
          item?.order?.type === 'sell' || item?.order?.type === 'layaway';
        return isSellOrLayaway ? sum + (item.quantity || 0) : sum;
      }, 0) || 0;

    return total + soldQuantity;
  }, 0);
};

export const getNumberLocationsPresentedFromProduct = (product): number => {
  if (!product?.productInventoryItems?.length) return 0;

  const locationIds = new Set<number>();

  product.productInventoryItems.forEach((item) => {
    if (item?.businessLocation?.id != null) {
      locationIds.add(item.businessLocation.id);
    }
  });

  return locationIds.size;
};

export const getProductGrossMarginFromProduct = (product): number => {
  const productInventoryItems = product?.productInventoryItems || [];

  if (!productInventoryItems.length) return 0;

  const productInventoryItemCosts: number[] = productInventoryItems
    .map((productInventoryItem) => {
      const events = productInventoryItem.product_inventory_item_events;
      const receiveEvents = events?.filter(
        (event) => event?.eventType === 'receive',
      );

      if (receiveEvents.length > 0) {
        return receiveEvents[0]?.itemCost;
      } else {
        return undefined;
      }
    })
    .filter(Boolean);

  const defaultPrice = product?.defaultPrice || productInventoryItems[0]?.price;

  const averageItemCost =
    productInventoryItemCosts.length > 0
      ? productInventoryItemCosts.reduce((sum, value) => sum + value, 0) /
        productInventoryItemCosts.length
      : 0;

  return defaultPrice
    ? ((defaultPrice - averageItemCost) / defaultPrice) * 100
    : 0;
};

const getOnOrderAmount = (product, businessLocationId?: string): number => {
  const productInventoryItems = product?.productInventoryItems ?? [];

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
export const getInventoryReportCSVHeaders = (
  extraColumns: string[],
): string[][] => {
  const csvHeaders = [
    [
      'BARCODE ID',
      'PRODUCT NAME',
      'SKU',
      'PRODUCT ID',
      'DEFAULT PRICE',
      'GROSS MARGIN',
      'QUANTITY SOLD',
      'QUANTITY LEFT',
      'ON ORDER',
      'RENTABLE',
      'LOCATIONS PRESENTED',
      'SUBLOCATIONS PRESENTED',
      'CREATION DATE',
    ],
  ];

  if (!extraColumns?.length) {
    return csvHeaders;
  }

  if (extraColumns.includes('productType')) {
    csvHeaders[0]?.push('PRODUCT TYPE');
  }

  if (extraColumns.includes('businessLocation')) {
    csvHeaders[0]?.push('BUSINESS LOCATIONS');
  }

  if (extraColumns.includes('weight')) {
    csvHeaders[0]?.push('WEIGHT');
  }

  return csvHeaders;
};

export const getInventoryReportCSVData = (
  product,
  extraColumns: string[],
  dateFormat,
  timeFormat,
): string[] => {
  const createdAtDateString = product?.createdAt
    ? formatDateAndTime(product?.createdAt, dateFormat, timeFormat)
    : '';

  const itemArr = [
    escapeCsvField(product?.barcode ?? ''),
    escapeCsvField(product?.name ?? ''),
    escapeCsvField(product?.SKU ?? ''),
    escapeCsvField(product?.productId ?? ''),
    escapeCsvField(product?.defaultPrice?.toString() ?? ''),
    formatToPercentage(product?.grossMargin as number),
    product?.totalQuantitySold?.toString() ?? '',
    product?.quantity?.toString() ?? '',
    product?.onOrder?.toString() ?? '',
    product?.rentableData?.enabled ? 'Yes' : 'No',
    product?.numberLocationsPresented?.toString() ?? '',
    product?.productInventoryItems
      ?.map(
        (item) =>
          item?.sublocationItems?.map((sublocationItem) => {
            const sublocationName = sublocationItem?.sublocation?.name;
            return sublocationName ? escapeCsvField(sublocationName) : null;
          }),
      )
      .map((arr) => arr?.filter(Boolean).join('; '))
      .filter(Boolean)
      .join('; ') ?? '',
    createdAtDateString,
  ];

  if (!extraColumns?.length) {
    return itemArr;
  }

  if (extraColumns?.includes('productType')) {
    itemArr.push(escapeCsvField(product?.productType?.name?.toString() ?? ''));
  }

  if (extraColumns?.includes('businessLocation')) {
    const businessLocations = product?.productInventoryItems
      ?.map((item) => escapeCsvField(item?.businessLocation?.name ?? ''))
      .filter(Boolean)
      .join('; ');

    itemArr.push(businessLocations ?? '');
  }

  if (extraColumns?.includes('weight')) {
    const weightValue = product?.weight?.value;
    const weightUnit = product?.weight?.unit;

    if (!(weightValue && weightUnit)) {
      itemArr.push(escapeCsvField(''));
    }

    itemArr.push(
      escapeCsvField(`${weightValue?.toString()} ${weightUnit?.toString()}`),
    );
  }

  return itemArr;
};

export const getInventoryReportCSVString = async (
  products,
  extraColumns: string[],
  userId,
) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getInventoryReportCSVHeaders(extraColumns)[0];
  const rows = products.map((product) =>
    getInventoryReportCSVData(product, extraColumns, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateInventoryReportData = async (job) => {
  const products = await strapi.entityService.findMany('api::product.product', {
    filters: {
      ...job?.data?.tenantFilter,
      ...job?.data?.reportFilter,
    },
    sort: ['createdAt:desc'],
    fields: inventoryReportExportDataProductFields as any,
    populate: inventoryReportExportDataPopulation as any,
  });

  const businessLocationId =
    job?.data?.reportFilter?.productInventoryItems?.businessLocation?.id?.[
      '$in'
    ];
  const sublocationId =
    job?.data?.reportFilter?.productInventoryItems?.sublocationItems
      ?.sublocation?.id?.['$eq'];

  const extendedProducts = [];

  for (const product of products) {
    const quantity = getQuantityFromProduct(
      product,
      businessLocationId,
      sublocationId,
    );
    const totalQuantitySold = getQuantitySoldFromProduct(
      product,
      businessLocationId,
    );
    const numberLocationsPresented =
      getNumberLocationsPresentedFromProduct(product);
    const grossMargin = getProductGrossMarginFromProduct(product);
    const onOrder = getOnOrderAmount(product, businessLocationId);

    extendedProducts.push({
      ...product,
      quantity,
      totalQuantitySold,
      numberLocationsPresented,
      grossMargin,
      onOrder,
    });
  }

  return extendedProducts;
};

export const generateInventoryReportCSV = async (job) => {
  const extendedProducts = await generateInventoryReportData(job);

  return getInventoryReportCSVString(
    extendedProducts,
    job?.data?.extraColumns,
    job?.data?.userId,
  );
};
