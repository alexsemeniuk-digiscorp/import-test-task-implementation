import { camelCase, isInteger, omit } from 'lodash';
import { handleError } from './../../../../../../helpers/errors';
import { filterNonEmptyItems } from './../../../../../../helpers/importingHelpers/filterHelpers';
import {
  parseHeaders,
  validateHeadersValues,
} from './../../../../../../helpers/importingHelpers/utils';
import {
  ADDITIONAL_ADDRESS_COLUMN_NAME,
  ADDITIONAL_EMAIL_COLUMN_NAME,
  ADDITIONAL_PHONE_NUMBER_COLUMN_NAME,
  FIRST_NOTES_ITERABLE_COLUMN_NAME,
  NOTES_EXPECTED_VALUES,
} from './../../utils/variables';
import { validateContactsData } from './../contactsDataValidators';

const checkValuesBetween = (
  defaultHeaders,
  startMarker,
  endMarker,
  targetValues,
) => {
  const startIndex = defaultHeaders.indexOf(startMarker);
  const endIndex = defaultHeaders.indexOf(endMarker);

  const segment = defaultHeaders.slice(startIndex + 1, endIndex);

  return segment?.length > 0
    ? targetValues.every((value) => segment.includes(value))
    : true;
};

const getContactsHeaderArrays = (serialisedHeaders: string[]) => {
  const notesFirstHeaderIndex = serialisedHeaders.indexOf('NOTES');
  const customFieldsHeaderIndex = serialisedHeaders.indexOf('CUSTOM FIELDS');

  const defaultHeaders =
    notesFirstHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, notesFirstHeaderIndex)]
      : customFieldsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, customFieldsHeaderIndex)]
      : [...serialisedHeaders];

  const emailCheck = checkValuesBetween(
    defaultHeaders,
    'EMAIL',
    'PHONE NUMBER',
    ['ADDITIONAL EMAIL'],
  );
  const phoneCheck = checkValuesBetween(
    defaultHeaders,
    'PHONE NUMBER',
    'ADDRESS',
    ['ADDITIONAL PHONE NUMBER'],
  );
  const addressCheck = checkValuesBetween(
    defaultHeaders,
    'ADDRESS',
    'DATE OF BIRTH',
    ['ADDITIONAL ADDRESS'],
  );

  if (!emailCheck || !phoneCheck || !addressCheck) {
    handleError(
      'getContactsHeaderArrays',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  const notesHeaders =
    notesFirstHeaderIndex !== -1
      ? [
          ...serialisedHeaders.slice(
            notesFirstHeaderIndex + 1,
            customFieldsHeaderIndex === -1
              ? undefined
              : customFieldsHeaderIndex,
          ),
        ]
      : [];

  const customFieldsHeaders =
    customFieldsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(customFieldsHeaderIndex + 1)]
      : [];

  return {
    defaultHeaders,
    notesHeaders,
    customFieldsHeaders,
    customFieldsHeaderIndex,
  };
};

export const validateContactItemsHeaders = (notesHeaders: string[]): void => {
  const notesValuesLength = NOTES_EXPECTED_VALUES.length;

  const lengthDivision = notesHeaders.length / notesValuesLength;

  if (lengthDivision && isInteger(lengthDivision)) {
    for (let i = 0; i < lengthDivision; i++) {
      const splittedArr = notesHeaders.slice(
        i * notesValuesLength,
        (i + 1) * notesValuesLength,
      );

      if (!validateHeadersValues(splittedArr, 'notes-values')) {
        handleError(
          'validateProductItemsHeaders',
          "Headers don't match the example file or have duplicate values",
          undefined,
          true,
        );
        break;
      }
    }
  } else {
    handleError(
      'validateProductItemsHeaders',
      'Products headers are not correct',
      undefined,
      true,
    );
  }
};

const validateContactsHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  const {
    defaultHeaders,
    notesHeaders,
    customFieldsHeaders,
    customFieldsHeaderIndex,
  } = getContactsHeaderArrays(serialisedHeaders);

  const filterAdditionalFields = defaultHeaders.filter(
    (header) =>
      header !== 'ADDITIONAL PHONE NUMBER' &&
      header !== 'ADDITIONAL EMAIL' &&
      header !== 'ADDITIONAL ADDRESS',
  );

  if (!validateHeadersValues(filterAdditionalFields, 'contacts')) {
    handleError(
      'validateContactsHeaders',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  if (notesHeaders.length > 0) {
    validateContactItemsHeaders(notesHeaders);
  }

  return { customFieldsHeaderIndex, defaultHeaders, customFieldsHeaders };
};

export const csvContactsToJSON = async (data: string[][]) => {
  const { headers, lines } = parseHeaders(data);
  const errors: string[] = [];

  const { customFieldsHeaderIndex, defaultHeaders, customFieldsHeaders } =
    validateContactsHeaders(headers, errors);

  if (!headers.some((header) => header.trim() === 'EMAIL')) {
    handleError(
      'csvContactsToJSON',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  const camelCaseHeaders: string[] = defaultHeaders.map((header) =>
    camelCase(header),
  );

  const jsonArray = [];
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const jsonObject = {};
    const notesFields = [];
    const additionalEmails: string[] = [];
    const additionalPhoneNumbers: string[] = [];
    const additionalAddresses: string[] = [];
    const parsedCustomFields = {};
    let notesArrayNumber = -1;

    for (let j = 0; j < headers.length; j++) {
      let currentValueName;
      switch (camelCaseHeaders[j]) {
        case 'createdDate':
          currentValueName = 'customCreationDate';
          break;
        case 'dateOfBirth':
          currentValueName = 'birthdayDate';
          break;
        case 'anniversaryDate':
          currentValueName = 'dateAnniversary';
          break;
        case 'contactOwner':
          currentValueName = 'leadOwner';
          break;
        case 'avatarId':
          currentValueName = 'avatar';
          break;
        case undefined:
          currentValueName = headers[j]?.trim();
          break;
        default:
          if (j < customFieldsHeaderIndex) {
            currentValueName = camelCaseHeaders[j]?.trim();
          }
      }

      if (headers[j] === ADDITIONAL_EMAIL_COLUMN_NAME) {
        additionalEmails.push(currentLine[j]?.trim());
      }

      if (headers[j] === ADDITIONAL_PHONE_NUMBER_COLUMN_NAME) {
        additionalPhoneNumbers.push(currentLine[j]?.trim());
      }

      if (headers[j] === ADDITIONAL_ADDRESS_COLUMN_NAME) {
        additionalAddresses.push(currentLine[j]?.trim());
      }

      if (j < customFieldsHeaderIndex) {
        jsonObject[currentValueName] = currentLine[j]?.trim();
      }

      if (j > customFieldsHeaderIndex) {
        parsedCustomFields[headers[j]] = currentLine[j]?.trim();
      }

      if (headers[j] === FIRST_NOTES_ITERABLE_COLUMN_NAME) {
        notesArrayNumber++;
        notesFields[notesArrayNumber] = {};
      }

      if (NOTES_EXPECTED_VALUES.includes(headers[j])) {
        notesFields[notesArrayNumber][camelCase(headers[j])] =
          currentLine[j]?.trim();
      }
    }

    const filteredAdditionalEmails = additionalEmails.filter(
      (email) => email !== '',
    );
    const filteredAdditionalPhoneNumbers = additionalPhoneNumbers.filter(
      (phoneNumber) => phoneNumber !== '',
    );
    const filteredAdditionalAddresses = additionalAddresses.filter(
      (address) => address !== '',
    );

    jsonObject['additionalEmails'] = filteredAdditionalEmails;
    jsonObject['additionalPhoneNumbers'] = filteredAdditionalPhoneNumbers;
    jsonObject['additionalAddresses'] = filteredAdditionalAddresses;
    jsonObject['notes'] = filterNonEmptyItems(notesFields);
    jsonObject['customFields'] = parsedCustomFields;
    jsonArray.push(omit(jsonObject, 'undefined', ''));
  }

  return {
    ...(await validateContactsData(jsonArray)),
    headers: camelCaseHeaders,
    customFieldsNames: customFieldsHeaders,
    errors,
  };
};
