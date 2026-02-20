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

export const EnumLeadSource = enumType({
  name: 'EnumLeadSource',
  members: [
    'walk_in',
    'external_referral',
    'online_store',
    'website',
    'advertisement',
    'google_ad',
    'facebook_ad',
    'google_search',
    'instagram',
    'tik_tok',
    'unknown',
  ],
});

export const MarketingOptionInEnum = enumType({
  name: 'MarketingOptionInEnum',
  members: ['Yes', 'No', 'N/A'],
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

export const validateContactsData = async (
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

    if (obj?.leadOwner && !isValidEmail(obj?.leadOwner)) {
      errors.push(`Invalid lead owner email format`);
    }

    if (obj.phoneNumber && !isValidPhoneNumber(obj.phoneNumber)) {
      errors.push(`Invalid phone number format`);
    }
    validateNumber('points', errors, obj?.points);
    isEnumValue(EnumLeadSource, errors, obj?.leadSource, true);
    validateDate('Date of Birth', errors, obj?.birthdayDate);
    validateDate('Date of Creation', errors, obj?.customCreationDate);
    validateDate('Date of Anniversary', errors, obj?.dateAnniversary);
    isValidIdRegex(errors, obj?.avatar);
    isEnumValue(MarketingOptionInEnum, errors, obj?.marketingOptIn);

    if (obj.additionalEmails?.length) {
      for (let i = 0; i < obj.additionalEmails?.length; i++) {
        if (obj.additionalEmails[i] && !isValidEmail(obj.additionalEmails[i])) {
          errors.push(`Invalid email format ${obj.additionalEmails[i]}`);
        }
      }
    }

    if (obj.additionalPhoneNumbers?.length) {
      for (let i = 0; i < obj.additionalPhoneNumbers?.length; i++) {
        if (
          obj?.additionalPhoneNumbers?.[i] &&
          !isValidPhoneNumber(obj?.additionalPhoneNumbers?.[i])
        ) {
          errors.push(`Invalid phone number format`);
        }
      }
    }

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
