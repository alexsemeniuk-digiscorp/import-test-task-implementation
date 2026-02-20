import dayjs from 'dayjs';
import { APP_ID } from '../../../product/helpers/importing/variables';
import {
  padArray,
  replaceUnderscoresWithSpaces,
} from './../../../../../graphql/helpers/arrayTransformers';
import {
  ORDERS_EXPECTED_VALUES,
  ORDER_PRODUCT_VALUES,
} from './../../helpers/importing/variables';

export const processOrdersImport = (
  arr: any[],
  { maxImagesCount, maxProductsCount, maxSerialNumbersCount },
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  const repeatedProductValues: string[] = [];
  for (let i = 0; i < maxProductsCount; i++) {
    repeatedProductValues.push(
      ...(ORDER_PRODUCT_VALUES || []),
      ...Array(maxSerialNumbersCount).fill('SERIAL NUMBER'),
    );
  }

  const csvResultHeaders = replaceUnderscoresWithSpaces([
    APP_ID,
    ...ORDERS_EXPECTED_VALUES,
    ...Array(maxImagesCount).fill('IMAGE'),
    'PRODUCTS',
    ...repeatedProductValues,
    'ERRORS',
  ]);

  interface ImportOrderItem {
    productId: string;
    quantity: string;
    price: string;
    taxName: string;
    note: string;
    serialNumbers?: string[];
  }

  const fieldsData = arr.map((field) => {
    const { products, images, errors, localId, ...otherValues } = field;

    const formattedCustomCreationDate = otherValues?.customCreationDate
      ? dayjs(otherValues.partsWarranty).format('MM-DD-YYYY')
      : '';

    const formattedDueDate = otherValues?.dueDate
      ? dayjs(otherValues.laborWarranty).format('MM-DD-YYYY')
      : '';
    const orderValues: string[] = [
      otherValues?.orderId ?? '',
      otherValues?.customer ?? '',
      otherValues?.employee ?? '',
      otherValues?.status ?? '',
      formattedCustomCreationDate,
      otherValues?.businessLocation ?? '',
      otherValues?.paidOff ?? '',
      formattedDueDate,
      otherValues?.layaway ?? '',
    ];
    const joinedErrors = Array.isArray(errors) ? errors.join('. ') : '';

    const productsArr = products
      ? products.flatMap((item: ImportOrderItem) => {
          const serialNumbersArray = new Array(maxSerialNumbersCount).fill('');

          if (item.serialNumbers?.length) {
            for (let i = 0; i < item.serialNumbers.length; i++) {
              if (i < maxSerialNumbersCount) {
                serialNumbersArray[i] = item.serialNumbers[i];
              }
            }
          }

          return [
            item.productId ?? '',
            item.quantity ?? '',
            item.price ?? '',
            item.taxName ?? '',
            item?.note ?? '',
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
      ...orderValues,
      ...padArray(imagesArr as string[], maxImagesCount),
      '',
      ...padArray(productsArr as string[], maxProductsCount),
      joinedErrors,
    ];
  });

  return { csvResultHeaders, fieldsData };
};
