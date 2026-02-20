import { camelCase, omit } from 'lodash';
import { handleError } from './../../../../../../helpers/errors';

import { filterNonEmptyItems } from './../../../../../../helpers/importingHelpers/filterHelpers';
import {
  getHeaderArrays,
  parseHeaders,
  validateHeadersValues,
} from './../../../../../../helpers/importingHelpers/utils';
import { validateProductsData } from './../../../importing/productsDataValidators';
import {
  ADDITIONAL_REPEATABLE_ITEM_VALUES,
  CUSTOM_FIELDS_HEADER,
  FIRST_BUSSINESS_IN_LOCATION_HEADER_NAME,
  IMAGE_COLUMN_NAME,
  PRODUCTS_EXPECTED_VALUES,
  PRODUCT_ITEMS_HEADER_NAME,
  PRODUCT_ITEM_VALUES,
} from './../../variables';
import { validateProductItemsHeaders } from './../utils';

const validateProductHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  const {
    defaultHeaders,
    imagesHeaders,
    productsHeaders,
    customFieldsHeaders,
    customFieldsHeaderIndex,
  } = getHeaderArrays(serialisedHeaders);

  if (!validateHeadersValues(defaultHeaders, 'products')) {
    handleError(
      'validateProductHeaders: Products',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }
  if (!imagesHeaders.every((header) => header === 'IMAGE')) {
    handleError(
      'validateProductHeaders:Images',
      'Images headers are not correct',
      undefined,
      true,
    );
  }

  if (productsHeaders.length > 0) {
    validateProductItemsHeaders(productsHeaders, errors);
  }
  return { customFieldsHeaderIndex, customFieldsHeaders };
};

export const csvProductsToJSON = async (data: string[][]) => {
  const { headers, lines } = parseHeaders(data);
  const errors: string[] = [];

  const { customFieldsHeaders } = validateProductHeaders(headers, errors);

  const camelCaseHeaders: string[] = PRODUCTS_EXPECTED_VALUES.map((header) =>
    camelCase(header),
  );

  const jsonArray = [];
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const jsonObject = {};
    const productItems: { [key: string]: string | string[] }[] = [];
    const images: string[] = [];
    let isCustomHeader = false;
    let productArrayNumber = -1;
    const parsedCustomFields = {};

    for (let j = 0; j < headers.length; j++) {
      if (j === 0) {
        isCustomHeader = false;
      }
      let currentValueName;
      switch (camelCaseHeaders[j]) {
        case 'engravedType':
          currentValueName = 'engravingType';
          break;
        case 'manufacturingProcess':
          currentValueName = 'process';
          break;
        case 'grossMarginCost':
          currentValueName = 'marginCost';
          break;
        case 'allowNegativeQuantity':
          currentValueName = 'isNegativeCount';
          break;
        case 'visibleItem':
          currentValueName = 'active';
          break;
        default:
          currentValueName = camelCaseHeaders[j]?.trim();
      }

      if (camelCaseHeaders[j]) {
        jsonObject[currentValueName] = currentLine[j]?.trim();
      }

      if (headers[j] === CUSTOM_FIELDS_HEADER) {
        isCustomHeader = true;
      }

      if (
        headers[j] === IMAGE_COLUMN_NAME ||
        headers[j] === PRODUCT_ITEMS_HEADER_NAME
      ) {
        isCustomHeader = false;
      }

      if (isCustomHeader && headers[j] !== CUSTOM_FIELDS_HEADER) {
        parsedCustomFields[headers[j]] = currentLine[j]?.trim();
      }

      if (headers[j] === IMAGE_COLUMN_NAME) {
        images.push(currentLine[j]?.trim());
      }

      if (headers[j] === FIRST_BUSSINESS_IN_LOCATION_HEADER_NAME) {
        productArrayNumber++;
        productItems[productArrayNumber] = {};
      }

      if (
        PRODUCT_ITEM_VALUES.includes(headers[j]) ||
        headers[j] === ADDITIONAL_REPEATABLE_ITEM_VALUES
      ) {
        switch (headers[j]) {
          case 'PRODUCT COST':
            productItems[productArrayNumber]['itemCost'] =
              currentLine[j]?.trim() === '' &&
              currentLine?.[j - 1]?.trim() !== ''
                ? '0'
                : currentLine[j]?.trim();
            break;
          case 'MEMO DUE DATE':
            productItems[productArrayNumber]['expiryDate'] =
              currentLine[j]?.trim();
            break;
          case ADDITIONAL_REPEATABLE_ITEM_VALUES: {
            const product = productItems[productArrayNumber];
            if (!product.serialNumbers) product.serialNumbers = [];
            if (currentLine[j] !== '') {
              (product.serialNumbers as string[]).push(currentLine[j]?.trim());
            }
            break;
          }
          default:
            productItems[productArrayNumber][camelCase(headers[j])] =
              currentLine[j]?.trim();
        }
      }
    }

    const filteredImages = images.filter((image) => image !== '');
    jsonObject['productItems'] = filterNonEmptyItems(productItems);
    jsonObject['images'] = filteredImages;
    jsonObject['customFields'] = parsedCustomFields;
    jsonArray.push(omit(jsonObject, 'undefined'));
  }

  return {
    ...(await validateProductsData(jsonArray)),
    customFieldsNames: customFieldsHeaders,
    headers,
    errors,
  };
};
