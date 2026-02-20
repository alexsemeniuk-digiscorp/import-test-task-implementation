import { handleError } from './../../../../../helpers/errors';
import { validateHeadersValues } from './../../../../../helpers/importingHelpers/utils';

export const validateRelationContactsHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  if (!validateHeadersValues(serialisedHeaders, 'contact-relations')) {
    handleError(
      'validateContactsHeaders',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  return { defaultHeaders: serialisedHeaders };
};
