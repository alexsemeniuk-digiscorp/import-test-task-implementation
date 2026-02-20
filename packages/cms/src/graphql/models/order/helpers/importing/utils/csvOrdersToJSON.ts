import { camelCase, omit } from 'lodash';
import { handleError } from './../../../../../helpers/errors';
import { filterNonEmptyItems } from './../../../../../helpers/importingHelpers/filterHelpers';
import {
  getHeaderArrays,
  parseHeaders,
  validateHeadersValues,
} from './../../../../../helpers/importingHelpers/utils';
import { validateOrdersData } from './../../importing/ordersDataValidators';
import { OrderDataWithErrors } from './../types';
import {
  ADDITIONAL_REPEATABLE_ITEM_VALUES,
  FIRST_ORDER_ITEM_COLUMN,
  IMAGE_COLUMN_NAME,
  ORDERS_EXPECTED_VALUES,
  ORDER_PRODUCT_VALUES,
} from './../variables';
import { validateOrderProductHeaders } from './utils';

const validateOrderHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  const { defaultHeaders, imagesHeaders, productsHeaders } =
    getHeaderArrays(serialisedHeaders);
  if (!validateHeadersValues(defaultHeaders, 'orders')) {
    handleError(
      'validateProductHeaders: ORDERS',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  if (!imagesHeaders.every((header) => header === 'IMAGE')) {
    handleError(
      'validateOrderHeaders:Images',
      'Images headers are not correct',
      undefined,
      true,
    );
  }

  if (productsHeaders.length > 0) {
    validateOrderProductHeaders(productsHeaders, errors);
  }
};

export const csvOrdersToJSON = async (
  data: string[][],
): Promise<{
  headers: string[];
  errors: string[];
  spoiledFields: OrderDataWithErrors[];
  normalizedFields: OrderDataWithErrors[];
}> => {
  try {
    const { headers, lines } = parseHeaders(data);
    const errors: string[] = [];
    validateOrderHeaders(headers, errors);
    const camelCaseDefaultHeaders: string[] = ORDERS_EXPECTED_VALUES.map(
      (header) => camelCase(header),
    );

    const jsonArray = [];

    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      const jsonObject: { [key: string]: string | any[] } = {};
      const productItems: { [key: string]: string | string[] }[] = [];
      const images: string[] = [];
      let productArrayNumber = -1;
      for (let j = 0; j < headers.length; j++) {
        let currentValueName;
        switch (camelCaseDefaultHeaders[j]) {
          case 'createdDate':
            currentValueName = 'customCreationDate';
            break;
          default:
            currentValueName = camelCaseDefaultHeaders[j]?.trim();
        }

        if (camelCaseDefaultHeaders[j]) {
          jsonObject[currentValueName] = currentLine[j]?.trim();
        }

        if (headers[j] === IMAGE_COLUMN_NAME) {
          images.push(currentLine[j]?.trim());
        }

        if (headers[j] === FIRST_ORDER_ITEM_COLUMN) {
          productArrayNumber++;
          productItems[productArrayNumber] = {};
        }

        if (
          ORDER_PRODUCT_VALUES.includes(headers[j]) ||
          headers[j] === ADDITIONAL_REPEATABLE_ITEM_VALUES
        ) {
          switch (headers[j]) {
            case ADDITIONAL_REPEATABLE_ITEM_VALUES: {
              const product = productItems[productArrayNumber];
              if (!product.serialNumbers) product.serialNumbers = [];
              if (currentLine[j] !== '') {
                (product.serialNumbers as string[]).push(
                  currentLine[j]?.trim(),
                );
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
      jsonObject['products'] = filterNonEmptyItems(productItems);
      jsonObject['images'] = filteredImages;

      jsonArray.push(omit(jsonObject, 'undefined'));
    }
    return {
      ...(await validateOrdersData(
        jsonArray as unknown as OrderDataWithErrors[],
      )),
      headers,
      errors,
    };
  } catch (e) {
    handleError('csvOrdersToJSON', undefined, e);
  }
};
