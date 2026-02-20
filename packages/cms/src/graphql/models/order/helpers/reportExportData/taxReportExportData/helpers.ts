import capitalize from 'lodash/capitalize';
import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import { formatDateAndTime } from '../../../../../helpers/formatDateAndTime';
import { getLocalizationSetting } from '../../../../../helpers/getLocalizationSetting';
import {
  taxReportExportDataOrderFields,
  taxReportExportDataPopulation,
} from './variables';

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

export const getTaxPortionFromOrder = (
  order,
  total: number,
  tax: number,
): number => {
  const onlyPaidTransactionsSummary = getPaidSummaryFromOrder(order);

  if (total > 0) {
    const taxPortion = ((onlyPaidTransactionsSummary ?? 0) / total) * tax;
    return taxPortion > tax ? tax : taxPortion;
  }
  return 0;
};

export const getSpecifiedTaxPortionsFromOrder = (order, points = null) => {
  const orderService = strapi.service('api::order.order');

  const { taxesReport } = orderService.getOrderFullCalculations(order);

  const specifiedTaxesPortions = {};

  for (let i = 0; i < Object.keys(taxesReport)?.length; i++) {
    const taxNameId = Object.keys(taxesReport)[i];
    if (!taxesReport[taxNameId]) {
      specifiedTaxesPortions[taxNameId] = 0;
    }
    specifiedTaxesPortions[taxNameId] = taxesReport[taxNameId];
  }

  return JSON.stringify(specifiedTaxesPortions);
};

export const getSpecifiedTaxPortionsAdjustedPricesFromOrder = (
  order,
  points = null,
) => {
  const orderService = strapi.service('api::order.order');

  const { taxesReportAdjustedPrice } =
    orderService.getOrderFullCalculations(order);

  const specifiedTaxesPortionsAdjustedPrices = {};

  for (let i = 0; i < Object.keys(taxesReportAdjustedPrice)?.length; i++) {
    const taxNameId = Object.keys(taxesReportAdjustedPrice)[i];
    if (!taxesReportAdjustedPrice[taxNameId]) {
      specifiedTaxesPortionsAdjustedPrices[taxNameId] = 0;
    }
    specifiedTaxesPortionsAdjustedPrices[taxNameId] =
      taxesReportAdjustedPrice[taxNameId];
  }

  return JSON.stringify(specifiedTaxesPortionsAdjustedPrices);
};

export const getPreTaxSales = (order): number => {
  const total = order?.total ?? 0;
  const tip = order?.tip ?? 0;
  const tax = order?.tax ?? 0;

  const preTaxSales = total - tip - tax;
  return parseFloat(preTaxSales.toFixed(2));
};

// csv helpers
export const getTaxesReportCSVHeaders = (
  extraColumns: string[],
): string[][] => {
  const csvHeaders = [
    [
      'CUSTOMER',
      'ORDER ID',
      'SOLD DATE',
      'SHIPPED DATE',
      'ECOMMERCE',
      'ORDER STATUS',
      'ORDER AMOUNT',
      'TAX OWED',
      'ORDER PRE TAX AMOUNT',
      'DISCOUNT',
      'POINTS',
      'TIP',
      'BUSINESS LOCATION',
      'TAX COLLECTED',
    ],
  ];

  if (!extraColumns?.length) {
    return csvHeaders;
  }

  const additionalDetailedTaxColumns = extraColumns?.filter((column) =>
    column.includes(':'),
  );

  const additionalTaxReportColumns = extraColumns?.filter(
    (column) => !column.includes(':'),
  );

  if (additionalDetailedTaxColumns?.length) {
    additionalDetailedTaxColumns.forEach((taxPortion) => {
      const title = taxPortion.split(':')[1].toUpperCase();

      csvHeaders[0]?.push(title);
      csvHeaders[0]?.push(`${title} ORDER PORTION`);
    });
  }

  if (additionalTaxReportColumns?.length) {
    if (additionalTaxReportColumns.includes('dueDate')) {
      csvHeaders[0]?.push('DUE DATE');
    }

    if (additionalTaxReportColumns.includes('type')) {
      csvHeaders[0]?.push('ORDER TYPE');
    }
  }

  return csvHeaders;
};

export const getTaxesReportCSVData = (
  taxReport,
  extraColumns: string[],
  dateFormat,
  timeFormat,
): string[] => {
  const soldDateString = taxReport?.customCreationDate
    ? formatDateAndTime(taxReport?.customCreationDate, dateFormat, timeFormat)
    : '';

  const shippedDateString = taxReport?.shippedDate
    ? formatDateAndTime(taxReport?.shippedDate, dateFormat, timeFormat)
    : '';

  const itemArr = [
    escapeCsvField(
      taxReport?.company?.name ?? taxReport?.contact?.fullName ?? '',
    ),
    taxReport?.orderId?.toString() ?? '',
    soldDateString,
    shippedDateString,
    taxReport?.ecommerceType ? 'Yes' : 'No',
    capitalize(taxReport?.status?.toString()) ?? '',
    taxReport?.total?.toString() ?? '',
    taxReport?.tax?.toString() ?? '',
    taxReport?.preTaxSales?.toString() ?? '',
    taxReport?.discount?.toString() ?? '0',
    taxReport?.points?.toString() ?? '0',
    taxReport?.tip?.toString() ?? '',
    escapeCsvField(taxReport?.businessLocation?.name ?? ''),
    taxReport?.taxPortion?.toFixed(2)?.toString() ?? '',
  ];

  if (!extraColumns?.length) {
    return itemArr;
  }

  const additionalDetailedTaxColumns = extraColumns?.filter((column) =>
    column.includes(':'),
  );
  const additionalTaxReportColumns = extraColumns?.filter(
    (column) => !column.includes(':'),
  );

  if (additionalDetailedTaxColumns?.length) {
    additionalDetailedTaxColumns.forEach((taxPortion) => {
      const parsedSpecifiedTaxPortions = taxReport?.specifiedTaxPortions
        ? JSON.parse(taxReport?.specifiedTaxPortions)
        : {};
      const parsedAdjustedPrices = taxReport?.specifiedTaxPortionsAdjustedPrices
        ? JSON.parse(taxReport?.specifiedTaxPortionsAdjustedPrices)
        : {};

      const specifiedTaxPortion =
        parsedSpecifiedTaxPortions[taxPortion]?.toFixed(2)?.toString() ??
        '0.00';

      const adjustedPortion =
        parsedAdjustedPrices[taxPortion]?.toFixed(2)?.toString() ?? '0.00';

      itemArr.push(specifiedTaxPortion);
      itemArr.push(adjustedPortion);
    });
  }

  if (additionalTaxReportColumns?.length) {
    if (additionalTaxReportColumns.includes('dueDate')) {
      const dueDateString = taxReport?.dueDate
        ? formatDateAndTime(taxReport?.dueDate, dateFormat, timeFormat)
        : '';

      itemArr.push(dueDateString);
    }

    if (additionalTaxReportColumns?.includes('type')) {
      itemArr.push(capitalize(taxReport?.type?.toString()) ?? '');
    }
  }

  return itemArr;
};

export const getTaxReportCSVString = async (
  taxReports,
  extraColumns: string[],
  userId,
) => {
  const { dateFormat, timeFormat } = await getLocalizationSetting(userId);

  const headers = getTaxesReportCSVHeaders(extraColumns)[0];
  const rows = taxReports.map((taxReport) =>
    getTaxesReportCSVData(taxReport, extraColumns, dateFormat, timeFormat),
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateTaxReportData = async (job) => {
  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      ...job?.data?.tenantFilter,
      ...job?.data?.reportFilter,
    },
    sort: ['customCreationDate:desc'],
    pagination: { limit: -1 },
    fields: taxReportExportDataOrderFields as any,
    populate: taxReportExportDataPopulation as any,
  });

  const extendedOrders = [];

  for (const order of orders) {
    const taxPortion = getTaxPortionFromOrder(
      order,
      order?.total ?? 0,
      order?.tax ?? 0,
    );
    const specifiedTaxPortions = getSpecifiedTaxPortionsFromOrder(order);
    const specifiedTaxPortionsAdjustedPrices =
      getSpecifiedTaxPortionsAdjustedPricesFromOrder(order);
    const preTaxSales = getPreTaxSales(order);

    extendedOrders.push({
      ...order,
      taxPortion,
      specifiedTaxPortions,
      specifiedTaxPortionsAdjustedPrices,
      preTaxSales,
    });
  }

  return extendedOrders;
};

export const generateTaxReportCSV = async (job) => {
  const extendedOrders = await generateTaxReportData(job);

  return getTaxReportCSVString(
    extendedOrders,
    job?.data?.extraColumns,
    job?.data?.userId,
  );
};
