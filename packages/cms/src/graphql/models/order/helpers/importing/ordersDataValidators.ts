import { enumType } from '@nexus/schema';
import capitalize from 'lodash/capitalize';
import { generateUUID } from '../../../../../utils/randomBytes';
import { stringNormalizer } from './../../../../helpers/formatter';
import {
  isBooleanValue,
  isEnumValue,
  isValidEmail,
  isValidIdRegex,
  TRUE_VALUE,
  validateDate,
  validateNumber,
  validateParameters,
} from './../../../../helpers/importingHelpers/validators';
import {
  cleanObjectValues,
  hasValidationErrors,
} from './../../../contact/helpers/importing/utils/contactsDataValidators';
import { OrderDataWithErrors } from './types';

const validateSerializedOrdersNumbersQuantity = (
  errors,
  quantity,
  serializedNumbersArray,
  productId,
) => {
  if (+quantity < serializedNumbersArray?.length) {
    errors.push(
      `The quantity for product ${productId} cannot be less than the number of a count of serialized numbers.`,
    );
  }
};

export const OrdersSalesStatusOptions = enumType({
  name: 'EnumSalesStatusOrderOptions',
  members: ['Incoming', 'Preparing', 'Draft', 'Shipped', 'Ready'],
});

export const OrdersLayawayStatusOptions = enumType({
  name: 'EnumLayawayStatusOrderOptions',
  members: ['Draft', 'Started', 'Paying', 'Paid', 'Shipped'],
});

export const validateOrdersData = async (data) => {
  const spoiledFields = [];

  const validationPromises = data.map(async (obj) => {
    const cleanObj = cleanObjectValues(obj) as OrderDataWithErrors;
    const errors: string[] = [];

    if (!cleanObj.businessLocation) {
      errors.push(`Missing required business location field`);
    }

    const emailFields = ['employee', 'customer'];

    emailFields.forEach((field) => {
      if (cleanObj[field] && !isValidEmail(cleanObj[field])) {
        errors.push(`Invalid email format of ${field}`);
      }
    });

    isBooleanValue('layaway', errors, cleanObj?.layaway);
    isEnumValue(
      stringNormalizer(cleanObj?.layaway) === TRUE_VALUE
        ? OrdersLayawayStatusOptions
        : OrdersSalesStatusOptions,
      errors,
      capitalize(cleanObj?.status),
    );
    validateDate('Due Date', errors, cleanObj?.dueDate);
    validateDate('Date of Creation', errors, cleanObj?.customCreationDate);
    isValidIdRegex(errors, cleanObj?.businessLocation);
    validateNumber('paidOff', errors, cleanObj?.paidOff);

    if (obj?.products?.length) {
      for (let i = 0; i < obj?.products?.length; i++) {
        const product = obj.products[i];
        validateParameters(
          product as unknown as Record<string, unknown>,
          ['price', 'quantity', 'productId', 'taxName'],
          'product',
          errors,
        );
        validateNumber('price', errors, product?.price);
        validateNumber('quantity', errors, product?.quantity);
        isValidIdRegex(errors, product?.productId);
        validateSerializedOrdersNumbersQuantity(
          errors,
          product?.quantity,
          product?.serialNumbers,
          product.productId,
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
