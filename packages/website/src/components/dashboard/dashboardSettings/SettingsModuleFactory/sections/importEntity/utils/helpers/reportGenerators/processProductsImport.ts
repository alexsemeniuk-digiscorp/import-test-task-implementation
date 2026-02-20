import { PRODUCT_ITEM_VALUES } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/utils/variables';
import { APP_ID } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/utils/utils';
import dayjs from 'dayjs';
import isNil from 'lodash/isNil';

interface ImportProductItem {
  expiryDate: string;
  memo: string;
  quantity: string;
  businessLocationId: string;
  productCost: string;
  vendor: string;
  orderCreationDate: string;
  paymentAmount: string;
  serialized: string;
  serialNumbers?: string[];
}
export const processProductsImport = (
  arr: any[],
  expectedHeadersArr: string[],
  replaceUnderscoresWithSpaces: (headers: string[]) => string[],
): { csvHeadersResult: string[]; fieldsDataResult: any[] } => {
  let maxImagesLength = 0;
  let maxProductsLength = 0;
  let maxSerialNumbersLength = 0;
  arr.forEach((item) => {
    if (item?.images?.length > maxImagesLength) {
      maxImagesLength = item.images.length;
    }

    if (item?.productItems?.length > maxProductsLength) {
      maxProductsLength = item?.productItems?.length;
    }

    if (item?.productItems?.length) {
      item.productItems.forEach((product: { serialNumbers: string[] }) => {
        if (
          product.serialNumbers?.length &&
          product.serialNumbers.length > maxSerialNumbersLength
        ) {
          maxSerialNumbersLength = product.serialNumbers.length;
        }
      });
    }
  });
  const customFieldsNames = arr[0]?.customFields
    ? Object.keys(arr[0].customFields)
    : [];

  const repeatedProductValues: string[] = [];
  for (let i = 0; i < maxProductsLength; i++) {
    repeatedProductValues.push(
      ...(PRODUCT_ITEM_VALUES?.slice(0, -1) || []),
      ...Array(maxSerialNumbersLength).fill('SERIAL NUMBER'),
    );
  }
  const csvHeadersResult = replaceUnderscoresWithSpaces([
    APP_ID,
    ...expectedHeadersArr,
    'CUSTOM FIELDS',
    ...customFieldsNames,
    ...Array(maxImagesLength).fill('IMAGE'),
    'PRODUCT ITEMS',
    ...repeatedProductValues,
    'ERRORS',
  ]);

  const fieldsDataResult = arr.map((field) => {
    const {
      productItems,
      images,
      errors,
      localId,
      customFields,
      ...otherValues
    } = field;

    const customValuesArr = Object.values(customFields)?.length
      ? Object.values(customFields)
      : [];

    const formattedPartsWarranty = otherValues?.partsWarranty
      ? dayjs(otherValues.partsWarranty).format('MM-DD-YYYY')
      : '';

    const formattedLaborWarranty = otherValues?.laborWarranty
      ? dayjs(otherValues.laborWarranty).format('MM-DD-YYYY')
      : '';
    const productValues: string[] = [
      otherValues?.regexedId ?? '',
      otherValues?.barcodeId ?? '',
      otherValues?.name ?? '',
      otherValues?.defaultPrice ?? '',
      otherValues?.productType ?? '',
      otherValues?.brand ?? '',
      otherValues?.model ?? '',
      otherValues?.dimensionLength ?? '',
      otherValues?.dimensionWidth ?? '',
      otherValues?.dimensionHeight ?? '',
      otherValues?.dimensionUnit ?? '',
      otherValues?.weight ?? '',
      otherValues?.weightUnit ?? '',
      otherValues?.sku ?? '',
      otherValues?.upc ?? '',
      otherValues?.mpn ?? '',
      otherValues?.ean ?? '',
      otherValues?.isbn ?? '',
      formattedPartsWarranty,
      formattedLaborWarranty,
      otherValues?.description ?? '',
    ];

    const joinedErrors = Array.isArray(errors) ? errors.join('. ') : '';
    const productsArr = productItems
      ? productItems.flatMap((item: ImportProductItem) => {
          const serialNumbersArray = new Array(maxSerialNumbersLength).fill('');

          if (item.serialNumbers?.length) {
            for (let i = 0; i < item.serialNumbers.length; i++) {
              if (i < maxSerialNumbersLength) {
                serialNumbersArray[i] = item.serialNumbers[i];
              }
            }
          }

          return [
            item.businessLocationId ?? '',
            item.quantity ?? '',
            item.productCost ?? '',
            item.vendor ?? '',
            item.orderCreationDate ?? '',
            item.paymentAmount ?? '',
            item.memo ?? '',
            item.expiryDate ?? '',
            item.serialized ?? '',
            ...serialNumbersArray,
          ];
        })
      : [];

    const imagesArr = Array.isArray(images)
      ? images.map((value: string) => (!isNil(value) ? value : ''))
      : [];

    return [
      ...productValues,
      '',
      ...customValuesArr,
      ...(imagesArr as string[]),
      '',
      ...(productsArr as string[]),
      joinedErrors,
    ];
  });
  return { csvHeadersResult, fieldsDataResult };
};
