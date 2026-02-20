import { isInteger } from 'lodash';
import { handleError } from './../../../../../helpers/errors';
import { validateHeadersValues } from './../../../../../helpers/importingHelpers/utils';
import {
  ADDITIONAL_REPEATABLE_ITEM_VALUES,
  ORDER_PRODUCT_VALUES,
} from './../variables';

const validateOrderItemArrayForCorrectValues = (arr, errors) => {
  arr.forEach((value) => {
    if (
      !ORDER_PRODUCT_VALUES.includes(value) &&
      value !== ADDITIONAL_REPEATABLE_ITEM_VALUES
    ) {
      errors.push(
        `Value ${value} is not valid as column in Products in location column names`,
      );
    }
  });
};

export const validateOrderProductHeaders = (
  extraProductsHeaders: string[],
  errors: string[],
): void => {
  const filterSerialNumbersExtraHeaders = extraProductsHeaders?.filter(
    (header) => header !== 'SERIAL NUMBER',
  );
  const orderProductValuesLength = ORDER_PRODUCT_VALUES.length;

  const lengthDivision =
    filterSerialNumbersExtraHeaders.length / orderProductValuesLength;

  if (lengthDivision && isInteger(lengthDivision)) {
    for (let i = 0; i < lengthDivision; i++) {
      const splittedArr = filterSerialNumbersExtraHeaders.slice(
        i * orderProductValuesLength,
        (i + 1) * orderProductValuesLength,
      );

      if (!validateHeadersValues(splittedArr, 'orders-products')) {
        handleError(
          'validateOrderProductHeaders',
          "Headers don't match the example file or have duplicate values",
          undefined,
          true,
        );
        break;
      }
      validateOrderItemArrayForCorrectValues(extraProductsHeaders, errors);
    }
  } else {
    handleError(
      'validateOrderProductHeaders',
      'Products headers are not correct',
      undefined,
      true,
    );
  }
};
