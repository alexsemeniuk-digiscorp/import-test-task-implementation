import { camelCase, omit } from 'lodash';
import { handleError } from './../../../helpers/errors';
import {
  parseHeaders,
  validateHeadersValues,
} from './../../../helpers/importingHelpers/utils';
import { validateContactItemsHeaders } from './../../contact/helpers/importing/utils/helpers/csvContactsToJSON';
import {
  FIRST_NOTES_ITERABLE_COLUMN_NAME,
  NOTES_EXPECTED_VALUES,
} from './../../contact/helpers/importing/utils/variables';

import { filterNonEmptyItems } from './../../../helpers/importingHelpers/filterHelpers';
import { validateCompaniesData } from './../../../models/company/helpers/createCompaniesToJSON/validateCompaniesData/validateCompaniesData';

const getCompaniesHeaderArrays = (serialisedHeaders: string[]) => {
  const notesFirstHeaderIndex = serialisedHeaders.indexOf('NOTES');

  const defaultHeaders =
    notesFirstHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, notesFirstHeaderIndex)]
      : [...serialisedHeaders];

  const notesHeaders =
    notesFirstHeaderIndex !== -1
      ? [...serialisedHeaders.slice(notesFirstHeaderIndex + 1)]
      : [];

  return {
    defaultHeaders,
    notesHeaders,
  };
};

const validateCompaniesHeaders = (
  serialisedHeaders: string[],
  errors: string[],
) => {
  const { defaultHeaders, notesHeaders } =
    getCompaniesHeaderArrays(serialisedHeaders);

  if (!validateHeadersValues(defaultHeaders, 'companies')) {
    handleError(
      'validateCompaniesHeaders',
      "Headers don't match the example file or have duplicate values",
      undefined,
      true,
    );
  }

  if (notesHeaders.length > 0) {
    validateContactItemsHeaders(notesHeaders);
  }

  return { defaultHeaders };
};

export const createCompaniesToJSON = async (data: string[][]) => {
  const { headers, lines } = parseHeaders(data);
  const errors: string[] = [];

  const { defaultHeaders } = validateCompaniesHeaders(headers, errors);

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
    let notesArrayNumber = -1;

    for (let j = 0; j < headers.length; j++) {
      let currentValueName;
      switch (camelCaseHeaders[j]) {
        case 'createdDate':
          currentValueName = 'customCreationDate';
          break;
        case 'avatarId':
          currentValueName = 'avatar';
          break;
        case undefined:
          currentValueName = headers[j]?.trim();
          break;
        default:
          currentValueName = camelCaseHeaders[j]?.trim();
      }

      jsonObject[currentValueName] = currentLine[j]?.trim();

      if (headers[j] === FIRST_NOTES_ITERABLE_COLUMN_NAME) {
        notesArrayNumber++;
        notesFields[notesArrayNumber] = {};
      }

      if (NOTES_EXPECTED_VALUES.includes(headers[j])) {
        notesFields[notesArrayNumber][camelCase(headers[j])] =
          currentLine[j]?.trim();
      }
    }

    jsonObject['notes'] = filterNonEmptyItems(notesFields);
    jsonArray.push(omit(jsonObject, 'undefined', ''));
  }

  return {
    ...(await validateCompaniesData(jsonArray)),
    headers: camelCaseHeaders,
    errors,
  };
};
