import { generateUUID } from './../../../../../../utils/randomBytes';
import {
  isValidEmail,
  isValidIdRegex,
} from './../../../../../helpers/importingHelpers/validators';
import { hasValidationErrors } from './../../importing/utils/contactsDataValidators';

export const validateWishlistData = async (
  data,
): Promise<{
  spoiledFields;
  normalizedFields;
}> => {
  const spoiledFields = [];

  const validationPromises = data.map(async (obj) => {
    const errors: string[] = [];

    if (!obj.contact) {
      errors.push(`Missing required CONTACT field`);
    } else {
      if (!isValidEmail(obj.contact)) {
        errors.push(`Invalid CONTACT's email format`);
      }
    }

    if (obj.products?.length) {
      for (let i = 0; i < obj.products?.length; i++) {
        isValidIdRegex(errors, obj?.products[i]);
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
