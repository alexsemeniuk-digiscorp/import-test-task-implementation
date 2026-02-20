import { handleError } from '../../../../../../helpers/errors';

interface CustomFieldsData {
  [attributeName: string]: string;
}

interface ParsedProduct {
  customFields?: CustomFieldsData;
  [key: string]: any;
}

interface ProductAttribute {
  id: number;
  name: string;
}

interface ProductAttributeOption {
  id: number;
  name: string;
  productAttribute?: {
    id: number;
    name?: string;
  };
}

export type CustomAttributeOptionsMap = Map<string, Map<string, number>>;

/**
 * Extracts all unique custom attribute names and their unique option values from all products
 * Returns a Map: attributeName -> Set of unique option values
 */
export const extractUniqueCustomAttributeValues = (
  normalizedFields: ParsedProduct[],
): Map<string, Set<string>> => {
  const attributeValuesMap = new Map<string, Set<string>>();

  for (const product of normalizedFields) {
    const customFields = product.customFields;
    if (!customFields) continue;

    for (const [attributeName, optionValue] of Object.entries(customFields)) {
      if (
        optionValue === null ||
        optionValue === undefined ||
        optionValue === ''
      ) {
        continue;
      }

      const trimmedValue = String(optionValue).trim();
      if (!trimmedValue) continue;

      if (!attributeValuesMap.has(attributeName)) {
        attributeValuesMap.set(attributeName, new Set());
      }
      attributeValuesMap.get(attributeName)!.add(trimmedValue);
    }
  }

  return attributeValuesMap;
};

/**
 * Fetches existing product attributes by name for a tenant and creates missing ones
 * Returns a Map: attributeName -> attributeId
 */
export const batchFetchOrCreateProductAttributes = async (
  attributeNames: string[],
  tenantId: number,
): Promise<Map<string, number>> => {
  if (attributeNames.length === 0) {
    return new Map();
  }

  const attributeNameToIdMap = new Map<string, number>();

  try {
    const existingAttributes = (await strapi.entityService.findMany(
      'api::product-attribute.product-attribute',
      {
        filters: {
          tenant: {
            id: {
              $eq: tenantId,
            },
          },
          name: {
            $in: attributeNames,
          },
        },
        fields: ['id', 'name'],
      },
    )) as ProductAttribute[];

    for (const attr of existingAttributes) {
      attributeNameToIdMap.set(attr.name, attr.id);
    }

    const missingAttributeNames = attributeNames.filter(
      (name) => !attributeNameToIdMap.has(name),
    );

    if (missingAttributeNames.length > 0) {
      const createPromises = missingAttributeNames.map(async (name) => {
        const newAttribute = await strapi.entityService.create(
          'api::product-attribute.product-attribute',
          {
            data: {
              name,
              tenant: tenantId,
            },
          },
        );
        return { name, id: Number(newAttribute.id) };
      });

      const createdAttributes = await Promise.all(createPromises);
      for (const attr of createdAttributes) {
        attributeNameToIdMap.set(attr.name, attr.id);
      }
    }
  } catch (e) {
    handleError('batchFetchOrCreateProductAttributes', undefined, e);
  }

  return attributeNameToIdMap;
};

/**
 * For a given attribute, fetches existing options and creates missing ones
 * Returns a Map: optionValue -> optionId
 */
const batchFetchOrCreateOptionsForAttribute = async (
  attributeId: number,
  optionValues: string[],
): Promise<Map<string, number>> => {
  const optionValueToIdMap = new Map<string, number>();

  if (optionValues.length === 0) {
    return optionValueToIdMap;
  }

  try {
    const existingOptions = (await strapi.entityService.findMany(
      'api::product-attribute-option.product-attribute-option',
      {
        filters: {
          productAttribute: {
            id: {
              $eq: attributeId,
            },
          },
          name: {
            $in: optionValues,
          },
        },
        fields: ['id', 'name'],
      },
    )) as ProductAttributeOption[];

    for (const opt of existingOptions) {
      optionValueToIdMap.set(opt.name, opt.id);
    }

    const missingOptionValues = optionValues.filter(
      (value) => !optionValueToIdMap.has(value),
    );

    if (missingOptionValues.length > 0) {
      const createPromises = missingOptionValues.map(async (name) => {
        const newOption = await strapi.entityService.create(
          'api::product-attribute-option.product-attribute-option',
          {
            data: {
              name,
              productAttribute: attributeId,
            },
          },
        );
        return { name, id: Number(newOption.id) };
      });

      const createdOptions = await Promise.all(createPromises);
      for (const opt of createdOptions) {
        optionValueToIdMap.set(opt.name, opt.id);
      }
    }
  } catch (e) {
    handleError('batchFetchOrCreateOptionsForAttribute', undefined, e);
  }

  return optionValueToIdMap;
};

/**
 * Main function to batch process all custom attributes and options before product import
 * Returns a nested Map: attributeName -> optionValue -> optionId
 */
export const batchProcessCustomAttributes = async (
  normalizedFields: ParsedProduct[],
  tenantId: number,
): Promise<CustomAttributeOptionsMap> => {
  const resultMap: CustomAttributeOptionsMap = new Map();

  try {
    const attributeValuesMap =
      extractUniqueCustomAttributeValues(normalizedFields);

    if (attributeValuesMap.size === 0) {
      return resultMap;
    }

    const attributeNames = Array.from(attributeValuesMap.keys());
    const attributeNameToIdMap = await batchFetchOrCreateProductAttributes(
      attributeNames,
      tenantId,
    );

    const optionProcessingPromises = Array.from(
      attributeValuesMap.entries(),
    ).map(async ([attributeName, optionValues]) => {
      const attributeId = attributeNameToIdMap.get(attributeName);
      if (!attributeId) {
        return { attributeName, optionMap: new Map<string, number>() };
      }

      const optionValuesArray = Array.from(optionValues);
      const optionMap = await batchFetchOrCreateOptionsForAttribute(
        attributeId,
        optionValuesArray,
      );

      return { attributeName, optionMap };
    });

    const optionResults = await Promise.all(optionProcessingPromises);

    for (const { attributeName, optionMap } of optionResults) {
      resultMap.set(attributeName, optionMap);
    }

    console.log(
      `[CUSTOM ATTRIBUTES] Processed ${
        attributeNames.length
      } attributes with ${Array.from(attributeValuesMap.values()).reduce(
        (sum, set) => sum + set.size,
        0,
      )} unique option values`,
    );
  } catch (e) {
    handleError('batchProcessCustomAttributes', undefined, e);
  }

  return resultMap;
};

/**
 * Gets the product attribute option IDs for a single product based on its customFields
 * Uses the pre-built lookup map for O(1) lookups
 */
export const getProductAttributeOptionIds = (
  customFields: CustomFieldsData | undefined,
  customAttributeOptionsMap: CustomAttributeOptionsMap,
): number[] => {
  const optionIds: number[] = [];

  if (!customFields || customAttributeOptionsMap.size === 0) {
    return optionIds;
  }

  for (const [attributeName, optionValue] of Object.entries(customFields)) {
    if (
      optionValue === null ||
      optionValue === undefined ||
      optionValue === ''
    ) {
      continue;
    }

    const trimmedValue = String(optionValue).trim();
    if (!trimmedValue) continue;

    const optionMap = customAttributeOptionsMap.get(attributeName);
    if (optionMap) {
      const optionId = optionMap.get(trimmedValue);
      if (optionId) {
        optionIds.push(optionId);
      }
    }
  }

  return optionIds;
};
