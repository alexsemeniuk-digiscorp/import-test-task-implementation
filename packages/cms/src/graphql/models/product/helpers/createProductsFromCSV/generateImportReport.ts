import dayjs from 'dayjs';
import { replaceUnderscoresWithSpaces } from './../../../../../graphql/helpers/arrayTransformers';
import { handleLogger } from './../../../../helpers/errors';
import {
  APP_ID,
  PRODUCT_ITEM_VALUES,
  PRODUCTS_EXPECTED_VALUES,
} from './../importing/variables';

interface ImportProductItem {
  itemCost: string;
  expiryDate: string;
  memo: string;
  quantity: string;
  businessLocationId: string;
  vendor: string;
  orderCreationDate: string;
  paymentAmount: string;
  serialized: string;
  serialNumbers?: string[];
}
export const processProductsImport = (
  arr: any[],
  { maxProductsCount, maxImagesCount, maxSerialNumbersCount },
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  const repeatedProductValues: string[] = [];
  for (let i = 0; i < maxProductsCount; i++) {
    repeatedProductValues.push(
      ...(PRODUCT_ITEM_VALUES?.slice(0, -1) || []),
      'SERIALIZED',
      ...Array(maxSerialNumbersCount).fill('SERIAL NUMBER'),
    );
  }
  const customFieldsNames = arr?.[0]?.customFields
    ? Object.keys(arr?.[0]?.customFields)
    : [];
  const csvResultHeaders = replaceUnderscoresWithSpaces([
    APP_ID,
    ...PRODUCTS_EXPECTED_VALUES,
    'CUSTOM FIELDS',
    ...customFieldsNames,
    ...Array(maxImagesCount).fill('IMAGE'),
    'PRODUCT ITEMS',
    ...repeatedProductValues,
    'ERRORS',
  ]);

  const fieldsData = arr.map((field) => {
    try {
      const {
        productItems,
        images,
        errors,
        localId,
        customFields,
        ...otherValues
      } = field;
      const customValuesArr = customFields
        ? Object.values(customFields)?.length
          ? Object.values(customFields)
          : []
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
        otherValues?.ecommerceDescription ?? '',
        otherValues?.shopifyTags ?? '',
        otherValues?.isNegativeCount ?? '',
        otherValues?.active ?? '',
      ];
      const joinedErrors = Array.isArray(errors) ? errors.join('. ') : '';
      const productsArr = productItems
        ? productItems.flatMap((item: ImportProductItem) => {
            const serialNumbersArray = new Array(maxSerialNumbersCount).fill(
              '',
            );

            if (item.serialNumbers?.length) {
              for (let i = 0; i < item.serialNumbers.length; i++) {
                if (i < maxSerialNumbersCount) {
                  serialNumbersArray[i] = item.serialNumbers[i];
                }
              }
            }

            return [
              item.businessLocationId ?? '',
              item.quantity ?? '',
              item.itemCost ?? '',
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

      const imagesArr =
        maxImagesCount > 0
          ? Array(maxImagesCount)
              .fill('')
              .map((_, i) => images?.[i] ?? '')
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
    } catch (e) {
      handleLogger('error', 'processProductsImport', e.message);
    }
  });
  return { csvResultHeaders, fieldsData };
};
