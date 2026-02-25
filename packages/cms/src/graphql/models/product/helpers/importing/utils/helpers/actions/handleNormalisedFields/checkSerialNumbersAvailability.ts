import { handleError } from './../../../../../../../../../graphql/helpers/errors';

const extractSerialNumbersFromProducts = (products: any[]): string[] => {
  const allSerialNumbers = [];

  for (const product of products) {
    const productItems = product?.productItems || [];
    for (const item of productItems) {
      const serialNumbers = item?.serialNumbers || [];
      if (serialNumbers.length) {
        allSerialNumbers.push(...serialNumbers);
      }
    }
  }

  return allSerialNumbers;
};

const getExistingSerialNumbers = async (
  serialNumbers: string[],
  tenantFilter: any,
) => {
  if (!serialNumbers.length) {
    return [];
  }

  return strapi.entityService.findMany(
    'api::inventory-serialize.inventory-serialize',
    {
      filters: { ...tenantFilter, name: { $in: serialNumbers } },
      fields: ['id', 'name'],
      populate: {
        sellingProductOrderItem: {
          fields: ['id'],
        },
        returnItem: {
          fields: ['id'],
        },
        inventoryAdjustmentItem: {
          fields: ['id'],
        },
        transferOrderItem: {
          fields: ['id'],
        },
        productInventoryItem: {
          fields: ['id'],
        },
      },
    },
  );
};

const isSerialNumberAvailable = (serialNumber: any) => {
  const hasRelations =
    serialNumber?.sellingProductOrderItem?.id ||
    serialNumber?.returnItem?.id ||
    serialNumber?.inventoryAdjustmentItem?.id ||
    serialNumber?.transferOrderItem?.id ||
    serialNumber?.productInventoryItem?.id;

  return !hasRelations;
};

export const batchGetUnavailableSerialNumbers = async (
  normalizedFields: any[],
  tenantFilter: any,
): Promise<Set<string>> => {
  const allSerialNumbers = extractSerialNumbersFromProducts(normalizedFields);
  const uniqueSerialNumbers = new Set(allSerialNumbers);

  if (!uniqueSerialNumbers.size) {
    return new Set<string>();
  }

  try {
    const existingSerialNumbers = await getExistingSerialNumbers(
      [...uniqueSerialNumbers],
      tenantFilter,
    );

    const unavailableSerialNumbers = new Set<string>();

    for (const serialNumber of existingSerialNumbers) {
      if (serialNumber.name && !isSerialNumberAvailable(serialNumber)) {
        unavailableSerialNumbers.add(serialNumber.name);
      }
    }

    return unavailableSerialNumbers;
  } catch (e) {
    handleError('batchGetUnavailableSerialNumbers', undefined, e);
    return new Set<string>();
  }
};

export const checkSerialNumbersAvailability = (
  productItems: any[],
  unavailableSerialNumbers: Set<string>,
) => {
  for (const item of productItems) {
    const serialNumbers = item?.serialNumbers || [];
    for (const serialNumber of serialNumbers) {
      if (unavailableSerialNumbers.has(serialNumber)) {
        return false;
      }
    }
  }

  return true;
};
