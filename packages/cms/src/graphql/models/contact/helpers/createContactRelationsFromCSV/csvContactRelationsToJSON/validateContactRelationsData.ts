import { generateUUID } from './../../../../../../utils/randomBytes';
import { isValidEmail } from './../../../../../helpers/importingHelpers/validators';
import { hasValidationErrors } from './../../importing/utils/contactsDataValidators';

export const validateContactRelationsData = async (
  data,
): Promise<{
  spoiledFields;
  normalizedFields;
}> => {
  const spoiledFields = [];

  const validationPromises = data.map(async (obj) => {
    const errors: string[] = [];

    if (!obj.fromContact) {
      errors.push(`Missing required CONTACT field`);
    } else {
      if (!isValidEmail(obj.fromContact)) {
        errors.push(`Invalid CONTACT's email format`);
      }
    }

    if (obj?.toContact && !isValidEmail(obj?.toContact)) {
      errors.push(`Invalid TO CONTACT email format`);
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
