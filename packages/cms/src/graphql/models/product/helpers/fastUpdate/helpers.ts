import { handleError } from '../../../../helpers/errors';
import { InventoryItem } from '../types/types';
import { stringNormalizer } from './../../../../helpers/formatter';
import {
  FALSE_VALUE,
  TRUE_VALUE,
} from './../../../../helpers/importingHelpers/validators';
import {
  handleProductItem,
  processInventoryEventAndOrder,
} from './../../helpers/importing/utils/utils';

export const separateLists = (
  oldList: InventoryItem[],
  newList: InventoryItem[],
) => {
  try {
    const oldUnique: InventoryItem[] = [];
    const duplicates: (InventoryItem & { quantityDifference: number })[] = [];
    const newUnique: InventoryItem[] = [];

    const newMap = new Map<string, InventoryItem>(
      newList.map((item) => [item.businessLocationId, item]),
    );

    oldList.forEach((oldItem) => {
      const newItem = newMap.get(oldItem.businessLocationId);

      if (newItem && newItem.quantity) {
        const quantityDifference = newItem.quantity - oldItem.quantity;
        duplicates.push({ ...oldItem, quantityDifference, ...newItem });
        newMap.delete(oldItem.businessLocationId);
      } else {
        oldUnique.push(oldItem);
      }
    });

    newMap.forEach((item) => {
      newUnique.push(item);
    });

    return { oldUnique, duplicates, newUnique };
  } catch (e) {
    handleError('separateLists', undefined, e);
  }
};

export const createOrUpdateEntity = async (
  entityType,
  existingEntityId,
  data,
) => {
  try {
    if (existingEntityId) {
      await strapi.entityService.update(entityType, existingEntityId, { data });
    } else {
      await strapi.entityService.create(entityType, { data });
    }
  } catch (e) {
    handleError(e, 'createOrUpdateEntity', 'fastUpdateSingleProduct');
  }
};

interface CreationArgument {
  productId: string;
  tenantId: string;
  userId: string;
  defaultPrice: string;
}

const handleNewItemsCreation = async (
  newItemsArray,
  { tenantId, productId, userId, defaultPrice }: CreationArgument,
  costOfGoodsAccountId,
  cashPaymentMethodId,
) => {
  for (const productItem of newItemsArray.filter(
    (item) => item.quantity && item.businessLocationId,
  )) {
    await handleProductItem({
      productItem,
      tenantId,
      productId,
      userId,
      defaultPrice,
      costOfGoodsAccountId,
      cashPaymentMethodId,
    });
  }
};

const handleUpdatingProductItems = async (
  duplicate,
  { defaultPrice, tenantId, userId, updatedProductUuid, productId },
  costOfGoodsAccountId,
  cashPaymentMethodId,
) => {
  try {
    const businessLocations = await strapi.entityService.findMany(
      'api::business-location.business-location',
      {
        filters: {
          businessLocationId: {
            $eq: duplicate.businessLocationId,
          },
        },
        fields: ['id'],
      },
    );

    const updatedInventoryItem = await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      duplicate?.id,
      {
        data: {
          defaultPrice: +defaultPrice,
          quantity: duplicate?.quantity,
        },
      },
    );

    if (updatedInventoryItem?.id) {
      await processInventoryEventAndOrder('update', {
        productItem: duplicate,
        createdInventoryItem: updatedInventoryItem,
        businessLocationId: businessLocations?.[0]?.id,
        productId,
        tenantId,
        userId,
        defaultPrice,
        costOfGoodsAccountId,
        cashPaymentMethodId,
      });
    }
  } catch (e) {
    handleError('handleUpdatingActivity', undefined, e);
  }
};

const classifySerialNumbers = async ({ duplicateId, serialNumbers }) => {
  const fetchedSerialNumbers = await strapi.entityService.findMany(
    'api::inventory-serialize.inventory-serialize',
    {
      filters: {
        productInventoryItem: {
          id: {
            $eq: duplicateId,
          },
        },
      },
      fields: ['id', 'name'],
    },
  );

  const newOnes = serialNumbers.filter(
    (item) => !fetchedSerialNumbers.some((fetched) => fetched.name === item),
  );

  const oldOnes = fetchedSerialNumbers.filter(
    (fetched) => !serialNumbers.includes(fetched.name),
  );

  const duplicated = fetchedSerialNumbers.filter((fetched) =>
    serialNumbers.includes(fetched.name),
  );

  return { newOnes, oldOnes, duplicated };
};

const handleSerialNumbersUpdating = async (duplicate, { tenantId }) => {
  const { newOnes, oldOnes } = await classifySerialNumbers({
    duplicateId: duplicate?.id,
    serialNumbers: duplicate?.serialNumbers,
  });
  if (oldOnes.length > 0) {
    await Promise.all(
      oldOnes.map((item) =>
        strapi.entityService.update(
          'api::inventory-serialize.inventory-serialize',
          item.id,
          {
            data: {
              productInventoryItem: null,
            },
          },
        ),
      ),
    );
  }

  if (newOnes.length > 0) {
    await Promise.all(
      newOnes.map((serialNumber) =>
        strapi.entityService.create(
          'api::inventory-serialize.inventory-serialize',
          {
            data: {
              name: serialNumber,
              productInventoryItem: duplicate?.id ?? null,
              tenant: tenantId ?? null,
            },
          },
        ),
      ),
    );
  }
};

const updateSerialization = async ({ duplicate, tenantId }) => {
  try {
    if (stringNormalizer(duplicate.serialized) === TRUE_VALUE) {
      await handleSerialNumbersUpdating(duplicate, { tenantId });
    }

    if (
      stringNormalizer(duplicate.serialized) === FALSE_VALUE ||
      !!stringNormalizer(duplicate.serialized)
    ) {
      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        duplicate.id,
        {
          data: {
            serializes: null,
            isSerializedInventory: false,
          },
        },
      );
      return;
    }

    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      duplicate.id,
      {
        data: {
          isSerializedInventory: true,
        },
      },
    );
  } catch (error) {
    handleError('updateSerialization', undefined, error);
  }
};

export const handleUpdatingInventoryItems = async ({
  defaultPrice,
  productId,
  productItems,
  tenantId,
  updatedProductUuid,
  userId,
  costOfGoodsAccountId,
  cashPaymentMethodId,
}) => {
  try {
    const fetchedProductItems = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters: {
          product: productId,
        },
        fields: ['id', 'quantity'],
        populate: {
          businessLocation: {
            fields: ['id', 'businessLocationId'],
          },
        },
      },
    );

    const mappedFetchedInventoryItemsArray = fetchedProductItems
      ?.filter(
        (item) => item.quantity && item?.businessLocation?.businessLocationId,
      )
      ?.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        businessLocationId: item?.businessLocation?.businessLocationId,
      }));

    const mappedParsedInventoryItemsArray: InventoryItem[] = productItems
      ?.filter(
        (item) => item.quantity && item.businessLocationId && item?.itemCost,
      )
      ?.map((item) => ({
        quantity: Number(item.quantity),
        businessLocationId: item.businessLocationId,
        itemCost: item?.itemCost,
        paymentAmount: item?.paymentAmount ?? '',
        vendorInfo: item?.vendorInfo,
        orderCreationDate: item?.orderCreationDate,
        serialized: item?.serialized,
        serialNumbers: item?.serialNumbers,
      }));
    const { duplicates, newUnique } = separateLists(
      mappedFetchedInventoryItemsArray as InventoryItem[],
      mappedParsedInventoryItemsArray,
    );

    if (duplicates.length > 0) {
      for (const duplicate of duplicates) {
        await updateSerialization({ duplicate, tenantId });
        if (duplicate.quantityDifference > 0) {
          await handleUpdatingProductItems(
            duplicate,
            {
              defaultPrice,
              tenantId,
              updatedProductUuid,
              userId,
              productId,
            },
            costOfGoodsAccountId,
            cashPaymentMethodId,
          );
        }
      }
    }
    await handleNewItemsCreation(
      newUnique,
      {
        productId: productId,
        tenantId: tenantId,
        userId: userId,
        defaultPrice: defaultPrice,
      },
      costOfGoodsAccountId,
      cashPaymentMethodId,
    );
  } catch (e) {
    handleError('handleNewItemsCreation', undefined, e);
  }
};
