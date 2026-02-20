import { enumType } from '@nexus/schema';
import { generateUUID } from '../../../../../../utils/randomBytes';
import { DEFAULT_EMAIL } from '../../../../../constants/defaultValues';
import {
  isEnumValue,
  isValidEmail,
  isValidIdRegex,
  isValidPhoneNumber,
  validateDate,
  validateNumber,
  validateParameters,
} from './../../../../../helpers/importingHelpers/validators';

export const PriceGroupEnum = enumType({
  name: 'PriceGroupEnum',
  members: ['retail', 'wholesale'],
});

export const CompanyTypeEnum = enumType({
  name: 'PriceGroupEnum',
  members: ['prospect', 'vendor'],
});

export const cleanObjectValues = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
};

export const hasValidationErrors = (obj): boolean => {
  return !!(obj?.errors && obj.errors.length > 0);
};

export const validateCompaniesData = async (
  data,
): Promise<{
  spoiledFields;
  normalizedFields;
}> => {
  const spoiledFields = [];

  const validationPromises = data.map(async (obj) => {
    const errors: string[] = [];

    if (!obj.email) {
      obj.email = DEFAULT_EMAIL;
    } else {
      if (!isValidEmail(obj.email)) {
        errors.push(`Invalid email format`);
      }
    }

    if (obj.phoneNumber && !isValidPhoneNumber(obj.phoneNumber)) {
      errors.push(`Invalid phone number format`);
    }
    validateNumber('points', errors, obj?.points);
    validateDate('Date of Creation', errors, obj?.customCreationDate);
    isValidIdRegex(errors, obj?.avatar);
    isEnumValue(PriceGroupEnum, errors, obj?.priceGroup);
    isEnumValue(CompanyTypeEnum, errors, obj?.type);

    if (obj?.notesFields?.length) {
      for (let i = 0; i < obj?.notesFields?.length; i++) {
        const note = obj.notesFields[i];

        validateParameters(
          note as unknown as Record<string, unknown>,
          ['note', 'noteCreationDate'],
          'products in location',
          errors,
        );

        validateDate('note', errors, note?.noteCreationDate);
      }
    }

    const objWithErrors = {
      ...obj,
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
