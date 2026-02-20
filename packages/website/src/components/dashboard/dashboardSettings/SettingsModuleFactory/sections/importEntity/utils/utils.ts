import { ContactDataWithErrors } from '@/components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/contacts/types/types';
import { PRODUCTS_EXPECTED_VALUES } from '@/components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/utils/variables';

import { processProductsImport } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/utils/helpers/reportGenerators/processProductsImport';
import { replaceUnderscoresWithSpaces } from '@helpers/formatter';

export const escapeCsvField = (value: string) => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const APP_ID = 'APP ID';

export const generateImportReport = (
  arr: ContactDataWithErrors[],
  expectedHeadersArr: string[],
  type:
    | 'ordersImport'
    | 'contactsImport'
    | 'productsImport'
    | 'contactsRelations'
    | 'wishlist',
  includeCustomFields = false,
): string => {
  let csvHeaders: string[] = [];
  const fieldsData: string[][] = [];

  switch (type) {
    case 'productsImport': {
      const { csvHeadersResult, fieldsDataResult } = processProductsImport(
        arr,
        expectedHeadersArr,
        replaceUnderscoresWithSpaces,
      );

      fieldsData.push(...fieldsDataResult);
      csvHeaders = csvHeadersResult;
      break;
    }
  }

  const csvArr = [csvHeaders, ...fieldsData];
  return csvArr.map((row) => row.map(escapeCsvField).join(',')).join('\n');
};

const checkForDuplicates = (arr: string[]) => {
  const valueCounts: { [key: string]: number } = {};

  for (const value of arr) {
    if (!valueCounts[value]) {
      valueCounts[value] = 1;
    } else {
      valueCounts[value] += 1;
    }
  }

  for (const value in valueCounts) {
    if (valueCounts[value] >= 2) {
      return true;
    }
  }

  return false;
};

export const validateHeadersValues = (
  arr: string[],
  type:
    | 'contacts'
    | 'products'
    | 'orders'
    | 'orders-products'
    | 'product-items',
) => {
  let expectedValuesArr: string[] = [];
  switch (type) {
    case 'products':
      expectedValuesArr = PRODUCTS_EXPECTED_VALUES;
      break;
    default:
      expectedValuesArr = [];
  }

  if (arr.length !== expectedValuesArr.length) {
    return false;
  }

  if (checkForDuplicates(arr)) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    const trimmedValue = arr[i].trim();
    const expectedValue = expectedValuesArr[i];
    if (trimmedValue !== expectedValue) {
      return false;
    }
  }

  return true;
};

export const parseHeaders = (
  data: string[][],
): { headers: string[]; lines: string[][] } => {
  const headers = data[0];
  const slicedLines = data.slice(1);
  const filteredData = slicedLines.filter(
    (row) => !row.every((value) => value === ''),
  );

  return { headers, lines: filteredData };
};
