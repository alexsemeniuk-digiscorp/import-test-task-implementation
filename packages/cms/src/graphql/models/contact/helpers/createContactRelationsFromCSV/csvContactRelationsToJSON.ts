import { camelCase } from 'lodash';
import { parseHeaders } from './../../../../helpers/importingHelpers/utils';
import { validateContactRelationsData } from './csvContactRelationsToJSON/validateContactRelationsData';
import { validateRelationContactsHeaders } from './csvContactRelationsToJSON/validateRelationContactsHeaders';

export const csvContactRelationsToJSON = async (data: string[][]) => {
  const { headers, lines } = parseHeaders(data);
  const errors: string[] = [];

  const { defaultHeaders } = validateRelationContactsHeaders(headers, errors);

  const camelCaseHeaders: string[] = defaultHeaders.map((header) =>
    camelCase(header),
  );

  const jsonArray = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const jsonObject = {};

    for (let j = 0; j < headers.length; j++) {
      let currentValueName;
      switch (camelCaseHeaders[j]) {
        case 'contact':
          currentValueName = 'fromContact';
          break;
        case 'relation':
          currentValueName = 'relationType';
          break;
        case undefined:
          currentValueName = headers[j]?.trim();
          break;
        default:
          currentValueName = camelCaseHeaders[j]?.trim();
      }

      if (currentValueName) {
        jsonObject[currentValueName] = currentLine[j]?.trim() || null; // Handles missing or empty values
      }
    }

    jsonArray.push(jsonObject);
  }

  return {
    ...(await validateContactRelationsData(jsonArray)),
    headers: camelCaseHeaders,
    customFieldsNames: [],
    errors,
  };
};
