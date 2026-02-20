import { snakeCase } from 'lodash';
import { stringNormalizer } from './../../../../src/graphql/helpers/formatter';
import { DEFAULT_PHONE_NUMBER } from './../../constants/defaultValues';
import {
  COMMON_PHONE_REGEX,
  EMAIL_REGEX,
  FIRST_PHONE_REGEX,
  REGEXED_ID_REGEX,
  SECOND_PHONE_REGEX,
} from './../../constants/regexes';

export const TRUE_VALUE = 'true';
export const FALSE_VALUE = 'false';

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (phoneNumber === DEFAULT_PHONE_NUMBER) return true;

  return (
    FIRST_PHONE_REGEX.test(phoneNumber) ||
    SECOND_PHONE_REGEX.test(phoneNumber) ||
    COMMON_PHONE_REGEX.test(phoneNumber)
  );
};

export const validateDate = (
  fieldName: string,
  errors: string[],
  dateString?: string,
) => {
  if (dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format for ${fieldName}`);
    }
  }
};

export const validateNumber = (
  fieldName: string,
  errors: string[],
  numberString?: string,
) => {
  if (numberString) {
    const number = Number(numberString);
    if (isNaN(number)) {
      errors.push(`Invalid number format for ${fieldName}`);
    }
  }
};

export const isEnumValue = (
  enumObject,
  errors: string[],
  value?: string,
  isToLowerCase?: boolean,
) => {
  if (
    value &&
    !enumObject.config.members.includes(
      isToLowerCase
        ? value.includes(' ')
          ? snakeCase(value)
          : value.toLowerCase()
        : value,
    )
  ) {
    errors.push(`Value "${value}" is not one of the correct values.`);
  }
};

export const isValidIdRegex = (errors: string[], regexId?: string) => {
  if (!regexId) {
    return false;
  }
  const isValid = REGEXED_ID_REGEX.test(regexId);
  if (!isValid) {
    errors.push(`Invalid ID format: ${regexId}`);
  }
  return isValid;
};

export const validateParameters = (
  obj,
  params: string[],
  errorParameter: string,
  errors: string[],
): void => {
  const hasAny = params.some((param) => obj?.[param]);
  const hasAll = params.every((param) => {
    return Object.keys(obj).includes(param);
  });

  if (hasAny && !hasAll) {
    errors.push(
      `If any ${errorParameter} parameter is provided, all ${errorParameter} parameters must be provided`,
    );
  }
};

export const validateUniqueBusinessLocationId = (
  items: { quantity: string; businessLocationId: string }[],
  errors: string[],
) => {
  const seen = new Set<string>();

  items.forEach((item) => {
    if (seen.has(item.businessLocationId) && item.businessLocationId !== '') {
      errors.push(
        `Duplicate Business Location Id found: ${item.businessLocationId}`,
      );
    }
    seen.add(item.businessLocationId);
  });
  seen.clear();
};

export const isBooleanValue = (
  fieldName: string,
  errors: string[],
  booleanValue?: string,
) => {
  if (
    stringNormalizer(booleanValue) !== TRUE_VALUE &&
    stringNormalizer(booleanValue) !== FALSE_VALUE &&
    stringNormalizer(booleanValue) !== ''
  ) {
    errors.push(`${fieldName} must be either true or false`);
  }
};

export const validateUniqueProductItemId = (items, errors) => {
  const seen = new Set<string>();

  items.forEach((item) => {
    if (seen.has(item.productId) && item.productId !== '') {
      errors.push(`Duplicate Product Id found: ${item.productId}`);
    }
    seen.add(item.productId);
  });
  seen.clear();
};
