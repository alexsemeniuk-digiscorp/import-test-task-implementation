import Papa from 'papaparse';
import { COMPANIES_EXPECTED_VALUES } from './../../models/company/helpers/utils/variables';
import {
  CONTACT_RELATIONS_EXPECTED_VALUES,
  CONTACTS_EXPECTED_VALUES,
  NOTES_EXPECTED_VALUES,
  WISHLIST_VALUES,
} from './../../models/contact/helpers/importing/utils/variables';
import {
  ORDER_PRODUCT_VALUES,
  ORDERS_EXPECTED_VALUES,
} from './../../models/order/helpers/importing/variables';
import {
  CUSTOM_FIELDS_HEADER,
  PRODUCT_ITEM_VALUES,
  PRODUCT_ITEMS_HEADER_NAME,
  PRODUCTS_EXPECTED_VALUES,
} from './../../models/product/helpers/importing/variables';
import { handleError } from './../errors';
import { validateAndGetAvatarFileId } from './../fileHelpers';

export const parseAndProcessCSV = async (input, callback) => {
  const { uploadCsv } = input;

  const csvFile = await uploadCsv;
  if (!csvFile) {
    handleError('parseAndProcessCSV', 'No CSV file provided.', undefined, true);
  }

  const csvFileStream = csvFile?.createReadStream();
  if (!csvFileStream) {
    handleError(
      'parseAndProcessCSV',
      'Unable to read CSV file.',
      undefined,
      true,
    );
  }

  const parsedRows = [];
  await new Promise<void>((resolve, reject) => {
    Papa.parse(csvFileStream, {
      quoteChar: '"',
      skipEmptyLines: true,
      dynamicTyping: false,
      chunkSize: 1024,
      chunk: (chunkResult, parser) => {
        parser.pause();

        const rows = chunkResult.data;
        parsedRows.push(...rows);

        parser.resume();
      },
      complete: async () => {
        try {
          await callback(parsedRows, { reject, resolve });
        } catch (error) {
          reject(new Error(`Error processing CSV data: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`Papa Parse error: ${error.message}`));
      },
    });
  });
};

export const checkAllImages = async (
  images,
  tenantId,
  isImageCheck = false,
) => {
  let isImages = true;
  let imagesArray = [];
  for (let i = 0; i < images.length; i++) {
    const { isAvatarValid, fileFoundId } = await validateAndGetAvatarFileId(
      images[i],
      tenantId,
      isImageCheck,
    );
    if (isAvatarValid) {
      imagesArray.push(fileFoundId);
    } else {
      isImages = false;
      imagesArray = [];
      break;
    }
  }
  return {
    isImagesIdsValid: isImages,
    imagesIdsArray: imagesArray,
  };
};

export const parseHeaders = (
  data: string[][],
): { headers: string[]; lines: string[][] } => {
  const headers = data[0];
  const slicedLines = data.slice(1);
  const filteredData = slicedLines.filter(
    (row) => !row.every((value) => value === ''),
  );

  return { headers, lines: filteredData };
};

export const findOrCreateEntity = async ({
  entityType,
  fieldName,
  fieldValue,
  tenantId,
}) => {
  try {
    const entity = await strapi.entityService.findMany(entityType, {
      filters: {
        [fieldName]: {
          $eq: fieldValue.trim(),
        },
        tenant: tenantId,
      },
      tenant: tenantId,
      fields: ['id', fieldName],
      limit: 1,
    });

    let foundEntityId = entity?.[0]?.id;

    if (!foundEntityId) {
      const newEntity = await strapi.entityService.create(entityType, {
        data: {
          [fieldName]: fieldValue.trim(),
          tenant: tenantId,
        },
      });
      foundEntityId = newEntity?.id;
    }

    return foundEntityId;
  } catch (e) {
    handleError('findOrCreateEntity', undefined, e);
  }
};

export const getOrCreateEntityIdIfPresented = async ({
  fieldValue,
  entityType,
  fieldName,
  tenantId,
}) => {
  return fieldValue
    ? await findOrCreateEntity({ entityType, fieldName, fieldValue, tenantId })
    : undefined;
};

export const findExistingRelationEntities = async (
  normalizedFields,
  entityType,
  entityName: string,
  relationName: string,
  fieldName: string,
  tenantId,
) => {
  const fieldValues = new Set<string>();
  normalizedFields.forEach((parsedProduct: any) => {
    parsedProduct?.[entityName]?.forEach((item: any) => {
      if (item?.[relationName])
        fieldValues.add(String(item[relationName]).trim());
    });
  });

  if (fieldValues.size === 0) return [];

  const existingEntities = await strapi.entityService.findMany(entityType, {
    filters: {
      [fieldName]: {
        $in: Array.from(fieldValues),
      },
      tenant: tenantId,
    },
    fields: ['id', fieldName],
  });

  return Array.isArray(existingEntities)
    ? existingEntities
    : [existingEntities];
};

export const findOrCreateEntities = async (
  normalizedFields,
  entityType,
  entityName: string,
  fieldName: string,
  tenantId,
) => {
  const fieldValues: string[] = Array.from(
    new Set(
      (normalizedFields as Record<string, any>[])
        .map((p) => String(p?.[entityName] || '').trim())
        .filter((v) => v.length > 0),
    ),
  );

  if (!fieldValues?.length) return [];

  let existingEntitiesArray = [];

  const existingEntities = await strapi.entityService.findMany(entityType, {
    filters: {
      name: { $in: fieldValues },
      tenant: tenantId,
    },
    tenant: tenantId,
    fields: ['id', fieldName],
  });

  existingEntitiesArray = Array.isArray(existingEntities)
    ? existingEntities
    : existingEntities
    ? [existingEntities]
    : [];

  const existingValues = new Set(
    existingEntitiesArray.map((pt: any) => pt?.name).filter(Boolean),
  );
  const missingValues = fieldValues.filter(
    (value) => !existingValues.has(value),
  );

  let createdEntitiesArray: any[] = [];

  if (missingValues.length > 0) {
    createdEntitiesArray = await Promise.all(
      missingValues.map(async (value) => {
        const createdEntities = await strapi.entityService.create(entityType, {
          data: {
            [fieldName]: value.trim(),
            tenant: tenantId,
          },
        });

        return { id: createdEntities.id, name: createdEntities.name };
      }),
    );
  }

  return [...existingEntitiesArray, ...createdEntitiesArray];
};

export const findCostOfGoodsAccountId = async () => {
  const costOfGoodsAccount = await strapi.entityService.findMany(
    'api::chart-account.chart-account',
    {
      filters: {
        name: {
          $eq: 'Cost of Goods Sold',
        },
      },
      fields: ['id'],
    },
  );

  return costOfGoodsAccount?.[0]?.id;
};

export const findRevenueAccountId = async () => {
  const revenueAccount = await strapi.entityService.findMany(
    'api::chart-account.chart-account',
    {
      filters: {
        name: {
          $eq: 'Revenue',
        },
      },
      fields: ['id'],
    },
  );

  return revenueAccount?.[0]?.id;
};

export const findCashPaymentMethodId = async (tenantId) => {
  const cashPaymentMethod = await strapi.entityService.findMany(
    'api::payment-method.payment-method',
    {
      filters: {
        name: {
          $eq: 'cash',
        },
        tenant: {
          id: {
            $eq: tenantId,
          },
        },
      },
      fields: ['id'],
    },
  );

  return cashPaymentMethod?.[0]?.id;
};

export const getExistingEntityByField = async (
  field: 'name' | 'barcode' | 'email' | 'phoneNumber',
  uid: 'api::product.product' | 'api::contact.contact' | 'api::company.company',
  tenantFilter: Record<string, any>,
  fieldValue: string,
  excludedValue?: string,
) => {
  const fields = ['id', field, 'uuid'] as any;

  if (field === 'name' || field === 'barcode') {
    fields.push('productId');
  }
  try {
    const filters = {
      [field]: {
        $eq: fieldValue,
        ...(excludedValue ? { $ne: excludedValue } : {}),
      },
      tenant: {
        id: {
          $eq: tenantFilter?.tenant,
        },
      },
    };

    return await strapi.entityService.findMany(uid, {
      filters,
      fields: fields as any,
    });
  } catch (e) {
    handleError('getExistingEntityByField', undefined, e);
  }
};

export const getExistingEntitiesByFieldBatch = async (
  field: 'name' | 'barcode' | 'email' | 'phoneNumber',
  uid: 'api::product.product' | 'api::contact.contact' | 'api::company.company',
  tenantFilter: Record<string, any>,
  fieldValues: string[],
): Promise<Map<string, any>> => {
  if (!fieldValues || fieldValues.length === 0) {
    return new Map();
  }

  const fields = ['id', field, 'uuid'] as any;

  if (field === 'name' || field === 'barcode') {
    fields.push('productId');
  }

  try {
    const filters = {
      [field]: {
        $in: fieldValues,
      },
      tenant: tenantFilter?.tenant,
    };

    const results = await strapi.entityService.findMany(uid, {
      filters,
      tenant: tenantFilter?.tenant,
      fields: fields as any,
    });

    // Convert results array to Map for O(1) lookup
    const resultMap = new Map<string, any>();
    if (results && Array.isArray(results)) {
      results.forEach((entity) => {
        const key = entity[field];
        if (key) {
          resultMap.set(key, entity);
        }
      });
    }

    return resultMap;
  } catch (e) {
    handleError('getExistingEntitiesByFieldBatch', undefined, e);
    return new Map();
  }
};

const checkForDuplicates = (arr: string[]) => {
  const valueCounts: { [key: string]: number } = {};

  for (const value of arr) {
    if (!valueCounts[value]) {
      valueCounts[value] = 1;
    } else {
      valueCounts[value] += 1;
    }
  }

  for (const value in valueCounts) {
    if (valueCounts[value] >= 2) {
      return true;
    }
  }

  return false;
};

export const validateHeadersValues = (
  arr: string[],
  type:
    | 'contacts'
    | 'products'
    | 'orders'
    | 'orders-products'
    | 'product-items'
    | 'notes-values'
    | 'contact-relations'
    | 'wishlist'
    | 'companies',
) => {
  let expectedValuesArr: string[] = [];
  switch (type) {
    case 'contacts':
      expectedValuesArr = CONTACTS_EXPECTED_VALUES;
      break;
    case 'companies':
      expectedValuesArr = COMPANIES_EXPECTED_VALUES;
      break;
    case 'products':
      expectedValuesArr = PRODUCTS_EXPECTED_VALUES;
      break;
    case 'orders':
      expectedValuesArr = ORDERS_EXPECTED_VALUES;
      break;
    case 'orders-products':
      expectedValuesArr = ORDER_PRODUCT_VALUES;
      break;
    case 'product-items':
      expectedValuesArr = PRODUCT_ITEM_VALUES;
      break;
    case 'notes-values':
      expectedValuesArr = NOTES_EXPECTED_VALUES;
      break;
    case 'contact-relations':
      expectedValuesArr = CONTACT_RELATIONS_EXPECTED_VALUES;
      break;
    case 'wishlist':
      expectedValuesArr = WISHLIST_VALUES;
      break;
    default:
      expectedValuesArr = [];
  }
  if (arr.length !== expectedValuesArr.length) {
    return false;
  }
  if (checkForDuplicates(arr)) {
    return false;
  }
  for (let i = 0; i < arr.length; i++) {
    const trimmedValue = arr[i].trim();
    const expectedValue = expectedValuesArr[i];
    if (trimmedValue !== expectedValue) {
      return false;
    }
  }

  return true;
};

export const getHeaderArrays = (
  serialisedHeaders: string[],
  IMAGES_HEADER = 'IMAGE',
  PRODUCTS_HEADER = PRODUCT_ITEMS_HEADER_NAME,
) => {
  const imagesFirstHeader = serialisedHeaders.indexOf(IMAGES_HEADER);

  const imagesLastHeader = serialisedHeaders.lastIndexOf(IMAGES_HEADER);
  const productsHeaderIndex = serialisedHeaders.indexOf(PRODUCTS_HEADER);
  const customFieldsHeaderIndex =
    serialisedHeaders.indexOf(CUSTOM_FIELDS_HEADER);

  const defaultHeaders =
    customFieldsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, customFieldsHeaderIndex)]
      : imagesFirstHeader !== -1
      ? [...serialisedHeaders.slice(0, imagesFirstHeader)]
      : productsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(0, productsHeaderIndex + 1)]
      : [...serialisedHeaders];

  const customFieldsHeaders =
    customFieldsHeaderIndex !== -1 && imagesFirstHeader !== -1
      ? [
          ...serialisedHeaders.slice(
            customFieldsHeaderIndex + 1,
            imagesFirstHeader,
          ),
        ]
      : customFieldsHeaderIndex !== -1 && productsHeaderIndex !== -1
      ? [
          ...serialisedHeaders.slice(
            customFieldsHeaderIndex + 1,
            productsHeaderIndex + 1,
          ),
        ]
      : customFieldsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(customFieldsHeaderIndex + 1)]
      : [];

  const imagesHeaders =
    imagesFirstHeader !== -1 && imagesLastHeader !== -1
      ? [...serialisedHeaders.slice(imagesFirstHeader, imagesLastHeader + 1)]
      : [];

  const productsHeaders =
    productsHeaderIndex !== -1
      ? [...serialisedHeaders.slice(productsHeaderIndex + 1)]
      : [];

  return {
    defaultHeaders,
    imagesHeaders,
    productsHeaders,
    customFieldsHeaders,
    customFieldsHeaderIndex,
    imagesFirstHeader,
  };
};

export const getEntityIdIfExist = async ({
  fieldValue,
  entityType,
  fieldName,
  tenantId,
}) => {
  if (fieldValue) {
    const entity = await strapi.entityService.findMany(entityType, {
      filters: {
        [fieldName]: {
          $eq: fieldValue.trim(),
        },
        tenant: tenantId,
      },
      tenant: tenantId,
      fields: ['id', fieldName],
      limit: 1,
    });

    return entity?.[0]?.id ?? undefined;
  }

  return undefined;
};
