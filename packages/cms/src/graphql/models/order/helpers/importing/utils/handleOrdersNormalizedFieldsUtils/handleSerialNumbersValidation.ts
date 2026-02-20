import {
  createProductItemEntry,
  findOrCreateProductInventoryItem,
} from './../../orderImport';
const handleSuitableSerialNumbers = (products) => {
  for (const product of products) {
    if (
      product.inventoryType !== 'product' &&
      product.serialNumbers?.length > 0
    ) {
      return false;
    }
  }
  return true;
};

export const handleSerialNumbersValidation = async (
  products,
  {
    isSerialNumbersValidationNeeded,
    tenantFilter,
    businessLocationId,
    createModeOn,
  },
) => {
  //check if there is order items that are not products but with serial numbers

  const isSuitableSerialNumbers = handleSuitableSerialNumbers(products);
  let isSerialNumbersCorrect = true;
  let isSerialNumbersAvailable = true;
  let isEnoughItemQuantity = true;

  const ableToCreateProductItemsIds = [];
  const unableToCreateProductItemsIds = [];

  if (isSerialNumbersValidationNeeded && isSuitableSerialNumbers) {
    for (const parsedProduct of products) {
      if (parsedProduct.inventoryType === 'product') {
        const productItem = await findOrCreateProductInventoryItem(
          parsedProduct,
          tenantFilter,
          businessLocationId,
        );

        const serialNumbers = parsedProduct?.serialNumbers;

        //watch for existing serial numbers from input
        const existedSerialNumbers = await strapi.entityService.findMany(
          'api::inventory-serialize.inventory-serialize',
          {
            filters: {
              name: { $in: serialNumbers },
            },
            fields: ['name', 'id'],
            populate: {
              productInventoryItem: {
                fields: ['id'],
              },
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
            },
          },
        );
        //if the productItem of serial number is the current product or it doesn't has any relations
        isSerialNumbersAvailable = existedSerialNumbers?.every(
          (existedSerialNumber) => {
            if (
              existedSerialNumber?.sellingProductOrderItem?.id ||
              existedSerialNumber?.returnItem?.id ||
              existedSerialNumber?.inventoryAdjustmentItem?.id ||
              existedSerialNumber?.transferOrderItem?.id
            )
              return false;
            if (existedSerialNumber?.productInventoryItem?.id) {
              return (
                existedSerialNumber.productInventoryItem.id === productItem.id
              );
            }
            return true;
          },
        );

        (productItem as any).existedSerialNumbers = existedSerialNumbers?.map(
          (existed) => existed.id,
        );

        // options for if created mode is on
        // if the inventory product item is not isSerializedInventory - false
        if (createModeOn) {
          if (+productItem.quantity < +parsedProduct.quantity) {
            isEnoughItemQuantity = false;
          }

          if (
            !productItem?.isSerializedInventory &&
            serialNumbers?.length > 0
          ) {
            isSerialNumbersCorrect = false;
          }
        }

        //create mode on , item has bigger quantity and serial number is of product and available
        if (
          createModeOn &&
          isEnoughItemQuantity &&
          isSerialNumbersCorrect &&
          isSerialNumbersAvailable
        ) {
          ableToCreateProductItemsIds.push(
            createProductItemEntry(productItem, parsedProduct),
          );
        } else if (
          !createModeOn &&
          isSerialNumbersAvailable &&
          isSerialNumbersCorrect
        ) {
          ableToCreateProductItemsIds.push(
            createProductItemEntry(productItem, parsedProduct),
          );
        } else {
          unableToCreateProductItemsIds.push(productItem);
        }
      }
    }
  }
  return {
    resultItems: { ableToCreateProductItemsIds, unableToCreateProductItemsIds },
    validation: {
      isSerialNumbersAvailable,
      isSuitableSerialNumbers,
      isEnoughItemQuantity,
    },
  };
};
