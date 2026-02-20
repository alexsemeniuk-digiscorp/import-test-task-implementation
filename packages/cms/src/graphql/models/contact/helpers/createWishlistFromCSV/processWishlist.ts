import isNil from 'lodash/isNil';
import { replaceUnderscoresWithSpaces } from './../../../../helpers/arrayTransformers';
import { WISHLIST_VALUES } from './../importing/utils/variables';

export const processWishlistImport = (
  arr: any[],
  { maxWishlistProductsCount },
): { csvResultHeaders: string[]; fieldsData: any[] } => {
  // Ensure maxWishlistProductsCount is a valid number
  const safeMaxWishlistCount = Number.isInteger(maxWishlistProductsCount)
    ? maxWishlistProductsCount
    : 0;

  const csvResultHeaders = replaceUnderscoresWithSpaces([
    ...WISHLIST_VALUES,
    ...Array(safeMaxWishlistCount).fill('PRODUCT'),
    'ERRORS',
  ]);

  const fieldsData = arr.map((field) => {
    if (!field || typeof field !== 'object') {
      return ['ERROR: Invalid field data'];
    }

    const { errors, tenant, localId, products, ...otherValues } = field;

    const joinedErrors = Array.isArray(errors) ? errors.join('. ') : '';

    const wishlistValues: string[] = [otherValues?.contact ?? ''];

    const productsArr = Array.isArray(products)
      ? products.map((value: string) => (!isNil(value) ? value : ''))
      : [];

    return [...wishlistValues, ...productsArr, joinedErrors];
  });

  return { csvResultHeaders, fieldsData };
};
