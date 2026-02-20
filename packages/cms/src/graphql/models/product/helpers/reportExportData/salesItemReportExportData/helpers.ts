import { join } from 'lodash';
import capitalize from 'lodash/capitalize';
import Papa from 'papaparse';
import { NexusGenRootTypes } from '../../../../../../types/generated/graphql';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import {
  capitalizeEnum,
  formatToDays,
  formatToPercentage,
} from '../../../../../helpers/formatter';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  SalesItemReportWithSales,
  salesItemReportExportDataPopulation,
  salesItemReportExportDataProductFields,
} from './variables';

export const getSalesFullNameFromSalesItem = (
  salesItem: SalesItemReportWithSales,
): string => {
  return (
    [salesItem.sales?.firstName, salesItem.sales?.lastName]
      .filter(Boolean)
      .join(' ') || ''
  );
};

export const getDiscountAmount = (
  price: number,
  discountType: 'percentage' | 'fixed',
  discountAmount: number,
  discount: any,
  order: NexusGenRootTypes['Order'],
) => {
  const {
    applicableProducts = [],
    applicableServices = [],
    applicableClasses = [],
    applicableMemberships = [],
    applicableCompositeProducts = [],
    excludedProducts = [],
    excludedServices = [],
    excludedClasses = [],
    excludedMemberships = [],
    excludedCompositeProducts = [],
  } = discount;

  const hasApplicableItems =
    applicableProducts.length ||
    applicableServices.length ||
    applicableClasses.length ||
    applicableMemberships.length ||
    applicableCompositeProducts.length;

  const hasExcludedItems =
    excludedProducts.length ||
    excludedServices.length ||
    excludedClasses.length ||
    excludedMemberships.length ||
    excludedCompositeProducts.length;

  const isUniversal = !hasApplicableItems && !hasExcludedItems;

  switch (discountType) {
    case 'percentage':
      return (price * discountAmount) / 100;
    case 'fixed':
      if (isUniversal && order?.subTotal > 0) {
        const proportion = price / order?.subTotal;
        return parseFloat((discountAmount * proportion).toFixed(2));
      } else {
        return discountAmount;
      }
    default:
      return 0;
  }
};

export const getDiscountAmountSumForOrderItem = (
  price: number,
  quantity = 1,
  discounts?: NexusGenRootTypes['Discount'][],
  order?: NexusGenRootTypes['Order'],
) => {
  const discountAmounts = discounts?.map((discount) => {
    return (
      getDiscountAmount(
        price,
        discount.type,
        discount.amount ?? 0,
        discount,
        order,
      ) * quantity
    );
  });

  return discountAmounts?.reduce((acc, curr) => acc + curr, 0) ?? 0;
};

const getPaidSummaryFromOrder = (order): number => {
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

const getInventoryAmount = (product, businessLocationId?: string): number => {
  const productInventoryItems = product?.productInventoryItems ?? [];

  if (!productInventoryItems?.length) return 0;

  return productInventoryItems.reduce((sum, productInventoryItem) => {
    if (
      businessLocationId &&
      productInventoryItem?.businessLocation?.id?.toString() !==
        businessLocationId?.toString()
    ) {
      return sum;
    }

    return sum + (productInventoryItem?.quantity ?? 0);
  }, 0);
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

export const getShopItemExportData = (
  shopItemData,
  businessLocationId?: string,
) => {
  const taxService = strapi.service('api::tax.tax');
  const orderService = strapi.service('api::order.order');

  const shopOrder = shopItemData?.order;

  const shopOrderProduct = shopItemData?.productOrderItem;
  const shopOrderCompositeProduct = shopItemData?.compositeProductOrderItem;
  const shopOrderService = shopItemData?.serviceOrderItem;
  const shopOrderMembership = shopItemData?.membershipOrderItem;
  const shopOrderClass = shopItemData?.classOrderItem;

  const shopProduct = shopOrderProduct?.product?.product;
  const shopCompositeProduct =
    shopOrderCompositeProduct?.compositeProduct?.compositeProduct;
  const shopService = shopOrderService?.service?.serviceLocationInfo?.service;
  const shopMembership = shopOrderMembership?.membership;
  const shopClass = shopOrderClass?.class?.classLocationInfo?.class;

  const itemName =
    shopProduct?.name ||
    shopCompositeProduct?.name ||
    shopService?.name ||
    shopMembership?.name ||
    shopClass?.name ||
    '-';

  const itemSKU = shopProduct?.SKU || '';

  const itemPrice =
    shopOrderProduct?.price ||
    shopOrderCompositeProduct?.price ||
    shopOrderService?.price ||
    shopOrderMembership?.price ||
    shopOrderClass?.price ||
    '';

  const itemNote =
    shopOrderProduct?.note ||
    shopOrderCompositeProduct?.note ||
    shopOrderService?.note ||
    shopOrderMembership?.note ||
    shopOrderClass?.note ||
    '';

  const itemDefaultPrice =
    shopProduct?.defaultPrice ||
    shopCompositeProduct?.defaultPrice ||
    shopService?.defaultPrice ||
    shopMembership?.price ||
    shopClass?.defaultPrice ||
    '-';

  const singleTax =
    shopOrderProduct?.tax?.name ||
    shopOrderCompositeProduct?.tax?.name ||
    shopOrderService?.tax?.name ||
    shopOrderMembership?.tax?.name ||
    shopOrderClass?.tax?.name ||
    '';

  const collectionTax =
    shopOrderProduct?.taxCollection?.name ||
    shopOrderCompositeProduct?.taxCollection?.name ||
    shopOrderService?.taxCollection?.name ||
    shopOrderMembership?.taxCollection?.name ||
    shopOrderClass?.taxCollection?.name ||
    '';

  const itemTax = singleTax || collectionTax;

  const productDiscountPerItem = shopOrderProduct
    ? getDiscountAmountSumForOrderItem(
        shopOrderProduct?.price,
        1,
        shopOrderProduct?.discounts,
        shopOrderProduct?.order,
      )
    : 0;
  const compositeProductDiscountPerItem = shopOrderCompositeProduct
    ? getDiscountAmountSumForOrderItem(
        shopOrderCompositeProduct?.price,
        1,
        shopOrderCompositeProduct?.discounts,
        shopOrderCompositeProduct?.order,
      )
    : 0;
  const serviceDiscountPerItem = shopOrderService
    ? getDiscountAmountSumForOrderItem(
        shopOrderService?.price,
        1,
        shopOrderService?.discounts,
        shopOrderService?.order,
      )
    : 0;
  const membershipDiscountPerItem = shopOrderMembership
    ? getDiscountAmountSumForOrderItem(
        shopOrderMembership?.price,
        1,
        shopOrderMembership?.discounts,
        shopOrderMembership?.order,
      )
    : 0;
  const classDiscountPerItem = shopOrderClass
    ? getDiscountAmountSumForOrderItem(
        shopOrderClass?.price,
        1,
        shopOrderClass?.discounts,
        shopOrderClass?.order,
      )
    : 0;

  const itemDiscount =
    productDiscountPerItem ||
    compositeProductDiscountPerItem ||
    serviceDiscountPerItem ||
    membershipDiscountPerItem ||
    classDiscountPerItem;

  const productPointsAmountPerItem = shopOrderProduct
    ? orderService.getPointsAmountPerItem(shopOrderProduct)
    : 0;
  const compositeProductPointsAmountPerItem = shopOrderCompositeProduct
    ? orderService.getPointsAmountPerItem(shopOrderCompositeProduct)
    : 0;
  const servicePointsAmountPerItem = shopOrderService
    ? orderService.getPointsAmountPerItem(shopOrderService)
    : 0;
  const membershipPointsAmountPerItem = shopOrderMembership
    ? orderService.getPointsAmountPerItem(shopOrderMembership)
    : 0;
  const classPointsAmountPerItem = shopOrderClass
    ? orderService.getPointsAmountPerItem(shopOrderClass)
    : 0;

  const pointsAmountPerItem =
    productPointsAmountPerItem ||
    compositeProductPointsAmountPerItem ||
    servicePointsAmountPerItem ||
    membershipPointsAmountPerItem ||
    classPointsAmountPerItem;

  const productOrderItem = {
    productOrderItem: shopOrderProduct
      ? {
          ...shopOrderProduct,
          discountAmountPerItem: productDiscountPerItem,
          pointsAmountPerItem: productPointsAmountPerItem,
        }
      : undefined,
  };

  const compositeProductOrderItem = {
    compositeProductOrderItem: shopOrderCompositeProduct
      ? {
          ...shopOrderCompositeProduct,
          discountAmountPerItem: compositeProductDiscountPerItem,
          pointsAmountPerItem: compositeProductPointsAmountPerItem,
        }
      : undefined,
  };
  const serviceOrderItem = {
    serviceOrderItem: shopOrderService
      ? {
          ...shopOrderService,
          discountAmountPerItem: serviceDiscountPerItem,
          pointsAmountPerItem: servicePointsAmountPerItem,
        }
      : undefined,
  };
  const membershipOrderItem = {
    membershipOrderItem: shopOrderMembership
      ? {
          ...shopOrderMembership,
          discountAmountPerItem: membershipDiscountPerItem,
          pointsAmountPerItem: membershipPointsAmountPerItem,
        }
      : undefined,
  };
  const classOrderItem = {
    classOrderItem: shopOrderClass
      ? {
          ...shopOrderClass,
          discountAmountPerItem: classDiscountPerItem,
          pointsAmountPerItem: classPointsAmountPerItem,
        }
      : undefined,
  };

  const productTaxAmountPerItem = shopOrderProduct
    ? taxService.getTaxAmountPerItem(shopOrderProduct)
    : 0;
  const compositeProductTaxAmountPerItem = shopOrderCompositeProduct
    ? taxService.getTaxAmountPerItem(shopOrderCompositeProduct)
    : 0;
  const serviceTaxAmountPerItem = shopOrderService
    ? taxService.getTaxAmountPerItem(shopOrderService)
    : 0;
  const membershipTaxAmountPerItem = shopOrderMembership
    ? taxService.getTaxAmountPerItem(shopOrderMembership)
    : 0;
  const classTaxAmountPerItem = shopOrderClass
    ? taxService.getTaxAmountPerItem(shopOrderClass)
    : 0;

  const taxAmountPerItem =
    productTaxAmountPerItem ||
    compositeProductTaxAmountPerItem ||
    serviceTaxAmountPerItem ||
    membershipTaxAmountPerItem ||
    classTaxAmountPerItem;

  const calculatedPaidSummary = getPaidSummaryFromOrder(shopOrder);

  const paidTransactions = calculatedPaidSummary ?? 0;
  const points = shopOrder?.points ?? 0;
  const adjustedPrice =
    (itemPrice ?? 0) - (itemDiscount ?? 0) - (pointsAmountPerItem ?? 0);
  const denominator = (shopOrder.total ?? 0) - (shopOrder?.tip ?? 0);

  const currentPaid = parseFloat(
    denominator !== 0
      ? (
          ((paidTransactions + points) / denominator) *
          ((adjustedPrice ?? 0) + taxAmountPerItem)
        ).toFixed(2)
      : '0',
  );

  const currentPaidPreTax = parseFloat(
    denominator !== 0
      ? (
          currentPaid -
          (taxAmountPerItem * paidTransactions) / denominator
        ).toFixed(2)
      : '0',
  );

  const order = {
    order: shopOrder
      ? {
          ...shopOrder,
          paidSummary: currentPaid,
          paidSummaryPreTax: currentPaidPreTax,
        }
      : undefined,
  };

  const inventoryEventVendorName =
    shopItemData?.productInventoryItemEvent?.itemVendor?.name ||
    shopItemData?.productInventoryItemEvent?.itemContactVendor?.fullName ||
    '';

  const salesItemVendorName =
    shopItemData?.companyVendor?.name ||
    shopItemData?.contactVendor?.fullName ||
    '';

  const itemVendorName = inventoryEventVendorName || salesItemVendorName || '';

  const onOrder = shopProduct
    ? getOnOrderAmount(shopProduct, businessLocationId)?.toString()
    : '';

  const inventoryAmount = shopProduct
    ? getInventoryAmount(shopProduct, businessLocationId)?.toString()
    : '';

  const itemCategory =
    shopProduct?.productType?.itemCategory?.name ||
    shopService?.itemCategory?.name ||
    '';

  return {
    itemName,
    itemSKU,
    itemNote,
    itemTax,
    productDiscountPerItem,
    compositeProductDiscountPerItem,
    serviceDiscountPerItem,
    membershipDiscountPerItem,
    classDiscountPerItem,
    itemDiscount,
    productOrderItem,
    compositeProductOrderItem,
    serviceOrderItem,
    membershipOrderItem,
    classOrderItem,
    taxAmountPerItem,
    order,
    itemDefaultPrice,
    pointsAmountPerItem,
    itemVendorName,
    onOrder,
    inventoryAmount,
    itemCategory,
  };
};

const calculateGMROI = (item, discountAdjustedPrice): number | null => {
  const itemCost = item?.itemCost ?? 0;
  const itemAge = item?.age ?? 0;

  if (itemCost === 0 && itemAge === 0) return null;

  const grossMargin = discountAdjustedPrice - itemCost;
  const denominator = itemCost * (itemAge / 365);

  if (denominator === 0) return 0;

  return parseFloat((grossMargin / denominator).toFixed(2));
};

// csv helpers
export const getSalesItemReportCSVHeaders = (
  extraColumns: string[],
): string[][] => {
  const csvHeaders = [
    [
      'ITEM',
      'SKU',
      'ORDER ID',
      'ECOMMERCE',
      'ORDER STATUS',
      'CUSTOMER',
      'EMPLOYEE',
      'ITEM VENDOR',
      'DEFAULT VENDOR',
      'DEFAULT PRICE',
      'POS PRICE',
      'DISCOUNT ADJUSTED PRICE',
      'COST',
      'GROSS MARGIN',
      'GMROI',
      'ON ORDER',
      'TOTAL INVENTORY AMOUNT',
      'POINTS AMOUNT',
      'TAX',
      'TAX AMOUNT',
      'CURRENT PAID PRE TAX',
      'CURRENT PAID',
      'LOCATION',
      'SUBLOCATION',
      'AGE',
      'SOLD DATE',
      'PURCHASE ORDER',
      'TAKEN MEMO',
      'SOLD MEMO',
      'MEMO NUMBER',
      'SHIPPED DATE',
      'ITEM CATEGORY',
    ],
  ];

  if (!extraColumns?.length) {
    return csvHeaders;
  }

  if (extraColumns.includes('type')) {
    csvHeaders[0]?.push('ITEM TYPE');
  }

  if (extraColumns.includes('dueDate')) {
    csvHeaders[0]?.push('DUE DATE');
  }

  if (extraColumns.includes('note')) {
    csvHeaders[0]?.push('ITEM NOTE');
  }

  if (extraColumns.includes('serialize')) {
    csvHeaders[0]?.push('SERIAL NUMBER');
  }

  if (extraColumns.includes('productType')) {
    csvHeaders[0]?.push('PRODUCT TYPE');
  }

  if (extraColumns.includes('model')) {
    csvHeaders[0]?.push('PRODUCT MODEL');
  }

  if (extraColumns.includes('weight')) {
    csvHeaders[0]?.push('WEIGHT');
  }

  return csvHeaders;
};

export const getSalesItemReportCSVData = (
  item,
  extraColumns: string[],
  dateFormat,
  timeFormat,
): string[] => {
  const {
    itemName,
    itemSKU,
    itemNote,
    itemTax,
    itemDiscount,
    taxAmountPerItem,
    itemDefaultPrice,
    pointsAmountPerItem,
    itemVendorName,
    itemCategory,
  } = getShopItemExportData(item);

  const grossMarginString = formatToPercentage(item?.grossMargin) ?? '';
  const ageString = formatToDays(item?.age) ?? '';
  const soldDateString = item?.soldDate
    ? formatDateAndTime(item?.soldDate, dateFormat, timeFormat)
    : '';
  const shippedDateString = item?.order?.shippedDate
    ? formatDateAndTime(item?.order?.shippedDate, dateFormat, timeFormat)
    : '';

  const customerName = item?.contact?.fullName ?? item?.company?.name ?? '';
  const discountAdjustedPrice = (item?.price ?? 0) - (itemDiscount ?? 0);
  const gmroi = calculateGMROI(item, discountAdjustedPrice) ?? '';

  const itemArr = [
    escapeCsvField(itemName),
    escapeCsvField(itemSKU),
    item?.order?.orderId?.toString() ?? '',
    item?.order?.ecommerceType ? 'Yes' : 'No',
    capitalize(item?.order?.status?.toString()) ?? '',
    escapeCsvField(customerName),
    escapeCsvField(item?.sales?.fullName ?? ''),
    escapeCsvField(itemVendorName ?? ''),
    escapeCsvField(item?.productOrderItem?.product?.vendor?.name ?? ''),
    itemDefaultPrice?.toString() ?? '',
    item?.price?.toString() ?? '',
    discountAdjustedPrice?.toString() ?? '',
    item?.itemCost?.toString() ?? '',
    grossMarginString,
    gmroi,
    item?.onOrder?.toString() ?? '',
    item?.inventoryAmount?.toString() ?? '',
    (pointsAmountPerItem ?? 0)?.toString() ?? '',
    escapeCsvField(itemTax),
    (taxAmountPerItem ?? 0)?.toString() ?? '',
    item?.order?.paidSummaryPreTax?.toString() ?? '',
    item?.order?.paidSummary?.toString() ?? '',
    escapeCsvField(item?.businessLocation?.name ?? ''),
    escapeCsvField(item?.sublocation?.name ?? ''),
    ageString,
    soldDateString,
    item?.productInventoryItemEvent?.order?.orderId?.toString() ?? '',
    item?.memoTaken ? 'Yes' : 'No',
    item?.memoSold ? 'Yes' : 'No',
    escapeCsvField(
      item?.productInventoryItemEvent?.order?.memoNumber ??
        item?.productInventoryItemEvent?.memoNumber ??
        '',
    ),
    shippedDateString,
    escapeCsvField(itemCategory),
  ];

  if (!extraColumns?.length) {
    return itemArr;
  }

  const dueDateString = item?.dueDate
    ? formatDateAndTime(item?.dueDate, dateFormat, timeFormat)
    : '';

  if (extraColumns?.includes('type')) {
    itemArr.push(capitalizeEnum(item?.type ?? ''));
  }

  if (extraColumns?.includes('dueDate')) {
    itemArr.push(dueDateString);
  }

  if (extraColumns?.includes('note')) {
    const orderItemNote = join(itemNote.replace(/[\n,]/g, ' ').split(' '), ' ');

    itemArr.push(escapeCsvField(orderItemNote ?? ''));
  }

  if (extraColumns?.includes('serialize')) {
    itemArr.push(escapeCsvField(item?.serialize?.name?.toString() ?? ''));
  }

  if (extraColumns?.includes('productType')) {
    itemArr.push(
      escapeCsvField(
        item?.productOrderItem?.product?.product?.productType?.name?.toString() ??
          '',
      ),
    );
  }

  if (extraColumns?.includes('model')) {
    itemArr.push(
      escapeCsvField(
        item?.productOrderItem?.product?.product?.model?.toString() ?? '',
      ),
    );
  }

  if (extraColumns?.includes('weight')) {
    const weightValue = item?.productOrderItem?.product?.product?.weight?.value;
    const weightUnit = item?.productOrderItem?.product?.product?.weight?.unit;

    if (!(weightValue && weightUnit)) {
      itemArr.push(escapeCsvField(''));
    }

    itemArr.push(
      escapeCsvField(`${weightValue?.toString()} ${weightUnit?.toString()}`),
    );
  }

  return itemArr;
};

export const getSalesItemReportCSVString = async (
  items,
  extraColumns: string[],
  userId,
) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getSalesItemReportCSVHeaders(extraColumns)[0];
  const rows = items.map((item) =>
    getSalesItemReportCSVData(item, extraColumns, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateSalesItemReportData = async (job) => {
  const salesItemReports = await strapi.entityService.findMany(
    'api::sales-item-report.sales-item-report',
    {
      filters: {
        ...job?.data?.tenantFilter,
        ...job?.data?.reportFilter,
      },
      sort: ['soldDate:desc'],
      pagination: { limit: -1 },
      fields: salesItemReportExportDataProductFields as any,
      populate: salesItemReportExportDataPopulation as any,
    },
  );

  const businessLocationId =
    job?.data?.reportFilter?.businessLocation?.id?.['$in'];

  const extendedSalesItemReports = [];

  for (const salesItemReport of salesItemReports) {
    const fullName = getSalesFullNameFromSalesItem(salesItemReport);

    const {
      productOrderItem,
      compositeProductOrderItem,
      serviceOrderItem,
      membershipOrderItem,
      classOrderItem,
      order,
      onOrder,
      inventoryAmount,
    } = getShopItemExportData(salesItemReport, businessLocationId);

    extendedSalesItemReports.push({
      ...salesItemReport,
      sales: {
        fullName,
      },
      ...productOrderItem,
      ...compositeProductOrderItem,
      ...serviceOrderItem,
      ...membershipOrderItem,
      ...classOrderItem,
      ...order,
      onOrder,
      inventoryAmount,
    });
  }

  return extendedSalesItemReports;
};

export const generateSalesItemReportCSV = async (job) => {
  const extendedSalesItemReports = await generateSalesItemReportData(job);

  return getSalesItemReportCSVString(
    extendedSalesItemReports,
    job?.data?.extraColumns,
    job?.data?.userId,
  );
};
