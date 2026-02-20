import { handleError } from './../../../../../helpers/errors';
import { validateHeadersValues } from './../../../../../helpers/importingHelpers/utils';
import { PRODUCT_HEADER } from './../../importing/utils/variables';

const getHeaderWishlistArrays = (serialisedHeaders) => {
  const productsHeaderIndex = serialisedHeaders.indexOf(PRODUCT_HEADER);

  const defaultHeaders =
    productsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, productsHeaderIndex)]
      : [...serialisedHeaders];

  const productsHeaders =
    productsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(productsHeaderIndex + 1)]
      : [];

  return {
    defaultHeaders,
    productsHeaders,
  };
};

export const validateWishlistHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  const { defaultHeaders, productsHeaders } =
    getHeaderWishlistArrays(serialisedHeaders);

  if (!validateHeadersValues(defaultHeaders, 'wishlist')) {
    handleError(
      'validateContactsHeaders',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  if (!productsHeaders.every((header) => header === PRODUCT_HEADER)) {
    handleError(
      'validateWishlistHeaders:Wishlist',
      'Wishlist headers are not correct',
      undefined,
      true,
    );
  }

  return { defaultHeaders: serialisedHeaders };
};
