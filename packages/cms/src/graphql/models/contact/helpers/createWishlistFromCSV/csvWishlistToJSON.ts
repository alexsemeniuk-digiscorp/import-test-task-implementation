import { camelCase } from 'lodash';
import { PRODUCT_HEADER } from '../importing/utils/variables';
import { parseHeaders } from './../../../../helpers/importingHelpers/utils';
import { validateWishlistData } from './csvContactRelationsToJSON/validateWishlistData';
import { validateWishlistHeaders } from './csvContactRelationsToJSON/validateWishlistHeaders';

export const csvWishlistToJSON = async (data: string[][]) => {
  const { headers, lines } = parseHeaders(data);
  const errors: string[] = [];

  const { defaultHeaders } = validateWishlistHeaders(headers, errors);

  const camelCaseHeaders: string[] = defaultHeaders.map((header) =>
    camelCase(header),
  );

  const jsonArray = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const jsonObject = {};
    const products: string[] = [];

    for (let j = 0; j < headers.length; j++) {
      let currentValueName;
      switch (camelCaseHeaders[j]) {
        default:
          currentValueName = camelCaseHeaders[j]?.trim();
      }

      if (currentValueName) {
        jsonObject[currentValueName] = currentLine[j]?.trim() || null;
      }

      if (headers[j] === PRODUCT_HEADER) {
        products.push(currentLine[j]?.trim());
      }
    }

    const filteredProducts = products?.filter((product) => product !== '');
    jsonObject['products'] = filteredProducts ?? [];
    jsonArray.push(jsonObject);
  }

  return {
    ...(await validateWishlistData(jsonArray)),
    headers: camelCaseHeaders,
    customFieldsNames: [],
    errors,
  };
};
