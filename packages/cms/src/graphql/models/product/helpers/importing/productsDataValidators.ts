import { enumType } from '@nexus/schema';
import { generateUUID } from '../../../../../utils/randomBytes';
import { stringNormalizer } from './../../../../helpers/formatter';
import {
  TRUE_VALUE,
  isBooleanValue,
  isEnumValue,
  isValidEmail,
  isValidIdRegex,
  validateDate,
  validateNumber,
  validateParameters,
  validateUniqueBusinessLocationId,
} from './../../../../helpers/importingHelpers/validators';
import {
  cleanObjectValues,
  hasValidationErrors,
} from './../../../contact/helpers/importing/utils/contactsDataValidators';
import { ProductDataWithErrors } from './types';

export const EnumSizeUnit = enumType({
  name: 'EnumSizeUnit', // GraphQL Enum name
  members: ['mm', 'cm', 'm', 'in', 'ft', 'yd'], // Enum members
});

export const EnumWeightUnit = enumType({
  name: 'EnumWeightUnit', // GraphQL Enum name
  members: ['mg', 'g', 'kg', 'gr', 'oz', 'lb', 'ct', 'dwt'], // Enum members
});

const validateSerializedNumbersQuantity = (
  isSeralised,
  errors,
  quantity,
  serializedNumbersArray,
  businessLocationId,
) => {
  if (isSeralised) {
    if (+quantity !== serializedNumbersArray?.length) {
      errors.push(
        `If serialized is true the quantity of elements should be equal to whole quantity in ${businessLocationId} location`,
      );
    }
  }
};

const validateMemoisation = (isMemo, isExpiryDate, errors) => {
  if (isMemo && !isExpiryDate) {
    errors.push('If memo is true, memo due date should also be provided.');
  }
};

export const validateProductsData = async (
  data,
): Promise<{
  spoiledFields;
  normalizedFields;
}> => {
  const spoiledFields = [];

  const validationPromises = data.map(async (obj) => {
    const cleanObj = cleanObjectValues(obj) as ProductDataWithErrors;
    const errors: string[] = [];

    if (!cleanObj.name) {
      errors.push(`Missing required product name field`);
    }
    validateUniqueBusinessLocationId(cleanObj?.productItems, errors);
    validateParameters(
      cleanObj,
      ['dimensionLength', 'dimensionWidth', 'dimensionHeight', 'dimensionUnit'],
      'dimension',
      errors,
    );
    validateParameters(cleanObj, ['weight', 'weightUnit'], 'weight', errors);
    validateNumber('default price', errors, cleanObj?.defaultPrice);
    validateNumber('dimension width', errors, cleanObj?.dimensionWidth);
    validateNumber('dimension height', errors, cleanObj?.dimensionHeight);
    validateNumber('dimension length', errors, cleanObj?.dimensionLength);
    isEnumValue(EnumSizeUnit, errors, cleanObj?.dimensionUnit);
    isEnumValue(EnumWeightUnit, errors, cleanObj?.weightUnit);
    validateNumber('weight', errors, cleanObj?.weight);
    validateDate('Date of Parts Warranty', errors, cleanObj?.partsWarranty);
    validateDate('Date of Labor Warranty', errors, cleanObj?.laborWarranty);

    if (obj?.productItems?.length) {
      for (let i = 0; i < obj?.productItems?.length; i++) {
        const product = obj.productItems[i];
        if (product.vendor && !isValidEmail(product.vendor)) {
          errors.push(`Invalid vendor email format`);
        }
        validateParameters(
          product as unknown as Record<string, unknown>,
          [
            'businessLocationId',
            'quantity',
            'itemCost',
            'vendor',
            'orderCreationDate',
            'paymentAmount',
            'serialized',
          ],
          'products in location',
          errors,
        );

        isValidIdRegex(errors, product.businessLocationId);
        validateNumber('quantity', errors, product?.quantity);
        validateNumber('item cost', errors, product?.itemCost);
        validateNumber('payment amount', errors, product?.paymentAmount);
        validateDate('order creation date', errors, product?.orderCreationDate);
        isBooleanValue('memo', errors, product?.memo);
        validateDate('memo due date', errors, product?.expiryDate);
        isBooleanValue('serialized', errors, product?.serialized);
        validateSerializedNumbersQuantity(
          stringNormalizer(product?.serialized) === TRUE_VALUE,
          errors,
          product?.quantity,
          product?.serialNumbers,
          product.businessLocationId,
        );
      }
    }

    if (obj.images?.length) {
      for (let i = 0; i < obj.images?.length; i++) {
        isValidIdRegex(errors, obj?.images[i]);
      }
    }

    const objWithErrors = {
      ...cleanObj,
      errors,
      localId: generateUUID(),
    };

    spoiledFields.push(objWithErrors);
  });

  await Promise.all(validationPromises);

  const objectsWithoutErrors = spoiledFields.filter(
    (cleanObj) => !hasValidationErrors(cleanObj),
  );
  const objectsWithErrors = spoiledFields.filter((cleanObj) =>
    hasValidationErrors(cleanObj),
  );

  return {
    spoiledFields: objectsWithErrors,
    normalizedFields: objectsWithoutErrors,
  };
};
