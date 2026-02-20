import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { isInteger } from 'lodash';
import { NexusGenEnums } from '../../../../../../types/generated/graphql';
import { generateId } from '../../../../../../utils/randomBytes';
import { stringNormalizer } from './../../../../../../graphql/helpers/formatter';
import { handleError } from './../../../../../helpers/errors';
import {
  addDaysToDateAsDate,
  DEFAULT_MEMO_DAYS,
  getDaysDifference,
} from './../../../../../helpers/getDaysDifference';
import { validateHeadersValues } from './../../../../../helpers/importingHelpers/utils';
import { TRUE_VALUE } from './../../../../../helpers/importingHelpers/validators';
import {
  ADDITIONAL_REPEATABLE_ITEM_VALUES,
  PRODUCT_ITEM_VALUES,
} from './../variables';
import { getNewestProductAttributeOptionIds } from './utilsHelpers/utils';

export const handleCustomAttributes = async (
  customFields,
  cameCustomFields,
  foundCustomFieldNames,
  tenantId,
  createdProductId,
) => {
  const newFieldPromises = cameCustomFields.map(async (fieldName) => {
    const newCustomFieldName = await strapi.entityService.create(
      'api::product-attribute.product-attribute',
      {
        data: {
          name: fieldName,
          tenant: tenantId,
        },
      },
    );

    if (newCustomFieldName && newCustomFieldName.id) {
      if (!customFields[newCustomFieldName.name]) return;
      const newOpt = strapi.entityService.create(
        'api::product-attribute-option.product-attribute-option',
        {
          data: {
            name: customFields[newCustomFieldName.name],
            productAttribute: newCustomFieldName.id,
            products: [createdProductId],
          },
        },
      );
      return newOpt;
    }
  });

  const existingFieldPromises = foundCustomFieldNames.map(
    async (customField) => {
      const previousOptionValue = await strapi.entityService.findMany(
        'api::product-attribute-option.product-attribute-option',
        {
          filters: {
            name: customFields[customField.name],
            productAttribute: {
              id: {
                $eq: customField.id,
              },
            },
          },
          populate: {
            products: {
              fields: ['id'],
            },
          },
        },
      );
      if (previousOptionValue?.length > 0) {
        const existingOption = previousOptionValue[0];

        const existingProductIds = (existingOption.products || []).map(
          (product) => product.id,
        );

        if (!existingProductIds.includes(createdProductId)) {
          return strapi.entityService.update(
            'api::product-attribute-option.product-attribute-option',
            existingOption.id,
            {
              data: {
                products: [...existingProductIds, createdProductId],
              },
            },
          );
        }

        return;
      }
      return strapi.entityService.create(
        'api::product-attribute-option.product-attribute-option',
        {
          data: {
            name: customFields[customField.name],
            productAttribute: customField.id,
            products: [createdProductId],
          },
        },
      );
    },
  );

  const returnedValues = await Promise.all([
    ...newFieldPromises,
    ...existingFieldPromises,
  ]);
};

export const processCustomAttributes = async (
  customAttributes,
  { tenantId, productId },
) => {
  try {
    const validCustomAttributes = Object.fromEntries(
      Object.entries(customAttributes).filter(
        ([, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    if (Object.keys(validCustomAttributes).length === 0) return;

    const foundCustomAttributes = await strapi.entityService.findMany(
      'api::product-attribute.product-attribute',
      {
        filters: {
          tenant: {
            id: {
              $eq: tenantId,
            },
          },
          name: {
            $in: Object.keys(validCustomAttributes),
          },
        },
        fields: ['id', 'name'],
      },
    );

    const cameCustomFields = Object.keys(validCustomAttributes).filter(
      (field) =>
        !foundCustomAttributes.map((item) => item.name).includes(field),
    );
    if (Object.keys(validCustomAttributes).length > 0) {
      await handleCustomAttributes(
        validCustomAttributes,
        cameCustomFields,
        foundCustomAttributes,
        tenantId,
        productId,
      );
    }

    const product = await strapi.entityService.findOne(
      'api::product.product',
      productId,
      {
        fields: ['id'],
        populate: {
          productAttributeOptions: {
            fields: ['id', 'createdAt'],
            populate: {
              productAttribute: {
                fields: ['id', 'createdAt'],
              },
            },
          },
        },
      },
    );

    const newProductOptions = getNewestProductAttributeOptionIds(product);
    console.log('newProductOptions', newProductOptions);
    await strapi.entityService.update('api::product.product', product.id, {
      data: {
        productAttributeOptions: newProductOptions as ID[],
        _skipMeilisearchSync: true,
      },
    });
  } catch (e) {
    handleError('processCustomFields', undefined, e);
  }
};

export const validateProductQuantities = async ({
  parsedProduct,
  updatingInfo,
}) => {
  try {
    const existedProductInventoryItems = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters: {
          product: {
            $or: [
              {
                id: {
                  $eq: updatingInfo?.namesId || updatingInfo?.barcodesId,
                },
              },
              {
                uuid: {
                  $eq: updatingInfo?.namesUuid || updatingInfo?.barcodesUuid,
                },
              },
            ],
          },
        },
        fields: ['id', 'quantity'],
        populate: {
          businessLocation: {
            fields: ['id', 'businessLocationId'],
          },
        },
      },
    );
    if (
      !existedProductInventoryItems ||
      existedProductInventoryItems?.length === 0
    )
      return;
    parsedProduct?.productItems.forEach((product) => {
      const matchedInventoryItem = existedProductInventoryItems.find(
        (inventory) =>
          inventory.businessLocation.businessLocationId ===
          product.businessLocationId,
      );

      const incomingQuantity = parseInt(product?.quantity ?? 0, 10);
      const existingQuantity = matchedInventoryItem?.quantity ?? 0;

      if (incomingQuantity < existingQuantity) {
        parsedProduct.errors.push(
          `Incoming quantity (${incomingQuantity}) for businessLocationId: ${product?.businessLocationId} is less than the existing inventory quantity (${existingQuantity}).`,
        );
      }
    });
  } catch (e) {
    handleError('validateProductQuantities', undefined, e);
  }
};

const validateProductItemArrayForCorrectValues = (arr, errors) => {
  arr.forEach((value) => {
    if (
      !PRODUCT_ITEM_VALUES.includes(value) &&
      value !== ADDITIONAL_REPEATABLE_ITEM_VALUES
    ) {
      errors.push(
        `Value ${value} is not valid as column in Products in location column names`,
      );
    }
  });
};

export const validateProductItemsHeaders = (
  extraProductsHeaders: string[],
  errors: string[],
): void => {
  const filterSerialNumbersExtraHeaders = extraProductsHeaders?.filter(
    (header) => header !== 'SERIAL NUMBER',
  );
  const productItemValuesLength = PRODUCT_ITEM_VALUES.length;

  const lengthDivision =
    filterSerialNumbersExtraHeaders.length / productItemValuesLength;

  if (lengthDivision && isInteger(lengthDivision)) {
    for (let i = 0; i < lengthDivision; i++) {
      const splittedArr = filterSerialNumbersExtraHeaders.slice(
        i * productItemValuesLength,
        (i + 1) * productItemValuesLength,
      );

      if (!validateHeadersValues(splittedArr, 'product-items')) {
        handleError(
          'validateProductItemsHeader',
          "Headers don't match the example file or have duplicate values",
          undefined,
          true,
        );
        break;
      }
    }
    validateProductItemArrayForCorrectValues(extraProductsHeaders, errors);
  } else {
    handleError(
      'validateProductItemsHeaders',
      'Products headers are not correct',
      undefined,
      true,
    );
  }
};

const createDealTransactionOfPurchaseOrder = async ({
  orderId,
  productItem,
  tenantId,
  businessLocationId,
  costOfGoodsAccountId,
  cashPaymentMethodId,
}) => {
  try {
    if (!costOfGoodsAccountId)
      handleError(
        'createDealTransactionOfPurchaseOrder',
        'No Cost of Goods Sold Account Found',
      );
    if (productItem?.paymentAmount) {
      await strapi.entityService.create(
        'api::deal-transaction.deal-transaction',
        {
          data: {
            repetitive:
              'once' as NexusGenEnums['ENUM_DEALTRANSACTION_REPETITIVE'],
            summary: productItem?.paymentAmount,
            paid: productItem?.paymentAmount,
            dueDate: productItem.orderCreationDate
              ? new Date(productItem.orderCreationDate).toISOString()
              : new Date().toISOString(),
            company:
              productItem?.vendorInfo?.type === 'company'
                ? productItem?.vendorInfo?.id
                : null,
            contact:
              productItem?.vendorInfo?.type === 'contact'
                ? productItem?.vendorInfo?.id
                : null,
            sellingOrder: orderId,
            status: 'Paid' as NexusGenEnums['ENUM_DEALTRANSACTION_STATUS'],
            chartAccount: costOfGoodsAccountId,
            dealTransactionId: generateId(),
            paymentMethod: cashPaymentMethodId,
            tenant: tenantId,
            businessLocation: businessLocationId,
            customCreationDate: productItem.orderCreationDate
              ? new Date(productItem.orderCreationDate)
              : undefined,
            _skipSyncDealTransactionWithAccounting: true,
            _skipMeilisearchSync: true,
          },
        },
      );

      const leftToPay =
        Number(productItem?.itemCost) - Number(productItem?.paymentAmount);

      if (leftToPay > 0) {
        await strapi.entityService.create(
          'api::deal-transaction.deal-transaction',
          {
            data: {
              repetitive:
                'once' as NexusGenEnums['ENUM_DEALTRANSACTION_REPETITIVE'],
              summary: leftToPay,
              paid: 0,
              dueDate: productItem.orderCreationDate
                ? new Date(productItem.orderCreationDate).toISOString()
                : new Date().toISOString(),
              company:
                productItem?.vendorInfo?.type === 'company'
                  ? productItem?.vendorInfo?.id
                  : null,
              contact:
                productItem?.vendorInfo?.type === 'contact'
                  ? productItem?.vendorInfo?.id
                  : null,
              sellingOrder: orderId,
              status: 'Open' as NexusGenEnums['ENUM_DEALTRANSACTION_STATUS'],
              chartAccount: costOfGoodsAccountId,
              dealTransactionId: generateId(),
              paymentMethod: cashPaymentMethodId,
              tenant: tenantId,
              businessLocation: businessLocationId,
              customCreationDate: productItem.orderCreationDate
                ? new Date(productItem.orderCreationDate)
                : undefined,
              _skipSyncDealTransactionWithAccounting: true,
              _skipMeilisearchSync: true,
            },
          },
        );
      }
    }
  } catch (error) {
    handleError('createDealTransactionOfPurchaseOrder', undefined, error);
  }
};

const createAndProcessOrder = async (
  action,
  {
    productItem,
    businessLocationId,
    userId,
    productId,
    createdInventoryItem,
    tenantId,
    costOfGoodsAccountId,
    cashPaymentMethodId,
  },
) => {
  if (!productId) throw new Error('No product id provided');

  const quantity =
    action === 'create'
      ? productItem?.quantity?.toString()
      : productItem?.quantityDifference?.toString();
  const itemCost = Number(productItem?.itemCost);
  const subTotal = Number(itemCost || 0) * Number(quantity || 0);

  const isMemo = stringNormalizer(productItem?.memo) === TRUE_VALUE;
  const memoValue = isMemo
    ? productItem?.expiryDate
      ? getDaysDifference(productItem.orderCreationDate, productItem.expiryDate)
      : DEFAULT_MEMO_DAYS
    : null;

  const newOrder = await strapi.entityService.create('api::order.order', {
    data: {
      tenant: tenantId,
      orderId: generateId(),
      status: 'received' as NexusGenEnums['ENUM_ORDER_STATUS'],
      businessLocation: businessLocationId,
      total: subTotal,
      subTotal: subTotal,
      discount: 0,
      tax: 0,
      type: 'purchase' as NexusGenEnums['ENUM_ORDER_TYPE'],
      contact:
        productItem?.vendorInfo?.type === 'contact'
          ? productItem?.vendorInfo?.id
          : null,
      company:
        productItem?.vendorInfo?.type === 'company'
          ? productItem?.vendorInfo?.id
          : null,
      sales: userId,
      customCreationDate: productItem.orderCreationDate
        ? new Date(productItem.orderCreationDate).toISOString()
        : new Date().toISOString(),
      receiveDate: productItem.orderCreationDate
        ? new Date(productItem.orderCreationDate).toISOString()
        : new Date().toISOString(),
      memo: memoValue,
      _skipAfterCreateOrder: true,
      _skipAfterUpdateOrder: true,
      _skipMeilisearchSync: true,
    },
  });

  try {
    await Promise.all([
      strapi.entityService.create(
        'api::product-order-item.product-order-item',
        {
          data: {
            quantity:
              action === 'create'
                ? productItem?.quantity?.toString()
                : productItem?.quantityDifference?.toString(),
            purchaseType:
              'buy' as NexusGenEnums['ENUM_PRODUCTORDERITEM_PURCHASETYPE'],
            product: createdInventoryItem?.id,
            order: newOrder?.id,
            itemId: `${createdInventoryItem?.uuid}`,
            price: Number(productItem?.itemCost),
            _skipBeforeCreateOrderItem: true,
            _skipAfterCreateOrderItem: true,
          },
        },
      ),
      createDealTransactionOfPurchaseOrder({
        orderId: newOrder?.id,
        productItem,
        tenantId,
        businessLocationId,
        costOfGoodsAccountId,
        cashPaymentMethodId,
      }),
    ]);
  } catch (error) {
    handleError('createAndProcessOrder', undefined, error);
  }

  return newOrder?.id;
};

export const processInventoryEventAndOrder = async (
  action: 'create' | 'update',
  {
    productItem,
    createdInventoryItem,
    businessLocationId,
    productId,
    tenantId,
    userId,
    defaultPrice,
    costOfGoodsAccountId,
    cashPaymentMethodId,
  },
) => {
  try {
    const orderId = await createAndProcessOrder(action, {
      productItem,
      createdInventoryItem,
      businessLocationId,
      productId,
      userId,
      tenantId,
      costOfGoodsAccountId,
      cashPaymentMethodId,
    });

    const isMemo = stringNormalizer(productItem?.memo) === TRUE_VALUE;
    const receiveDate = productItem.orderCreationDate
      ? new Date(productItem.orderCreationDate)
      : new Date();

    const memoExpiryDate = isMemo
      ? productItem?.expiryDate
        ? new Date(productItem.expiryDate)
        : addDaysToDateAsDate(receiveDate, DEFAULT_MEMO_DAYS)
      : undefined;

    const event = await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          order: orderId,
          isImported: true,
          eventType:
            'receive' as NexusGenEnums['ENUM_PRODUCTINVENTORYITEMEVENT_EVENTTYPE'],
          change:
            action === 'create'
              ? productItem?.quantity?.toString()
              : productItem?.quantityDifference?.toString(),
          remainingQuantity:
            action === 'create'
              ? productItem?.quantity?.toString()
              : productItem?.quantityDifference?.toString(), // check here
          itemContactVendor:
            productItem?.vendorInfo?.type === 'contact'
              ? productItem?.vendorInfo?.id
              : null,
          itemVendor:
            productItem?.vendorInfo?.type === 'company'
              ? productItem?.vendorInfo?.id
              : null,
          productInventoryItem: createdInventoryItem?.id,
          addedBy: userId,
          businessLocation: businessLocationId,
          tenant: tenantId,
          itemCost: productItem.itemCost,
          receiveDate: productItem.orderCreationDate
            ? new Date(productItem.orderCreationDate).toISOString()
            : new Date().toISOString(),
          memo: isMemo,
          expiryDate: memoExpiryDate,
          _skipSaleItemReportMarginGrossAndAgeUpdate: true,
          _skipBeforeUpdateProductInventoryItemEvent: true,
          _skipAfterUpdateProductInventoryItemEvent: true,
        },
      },
    );

    //! create item records
    const remainingQuantity =
      action === 'create'
        ? productItem?.quantity
        : productItem?.quantityDifference;

    if (remainingQuantity > 0) {
      const productInventoryEventService = strapi.service(
        'api::product-inventory-item-event.product-inventory-item-event',
      );

      const calculatedAge =
        productInventoryEventService.getProductInventoryItemEventAge(event);

      const { calculatedGrossMargin, calculatedItemPrice } =
        productInventoryEventService.getProductInventoryItemEventGrossMargin(
          event,
          Number(createdInventoryItem?.price),
          undefined,
          Number(defaultPrice),
          undefined,
        );

      const createRecordsForQuantity = async (quantity: number) => {
        const chunkSize = 100;
        const records = [];

        for (let i = 0; i < quantity; i++) {
          const recordData = {
            productInventoryItemEvent: event.id,
            productInventoryItem: createdInventoryItem?.id,
            tenant: tenantId,
            age: calculatedAge,
            grossMargin: calculatedGrossMargin,
            price: calculatedItemPrice,
            memoTaken: event?.memo ?? false,
            memoSold: false,
          };
          records.push(recordData);

          if (records.length === chunkSize || i === quantity - 1) {
            await Promise.all(
              records.map((record) =>
                strapi.entityService.create(
                  'api::invt-itm-record.invt-itm-record',
                  {
                    data: record,
                  },
                ),
              ),
            );
            records.length = 0;
          }
        }
      };

      await createRecordsForQuantity(remainingQuantity);
    }
  } catch (error) {
    handleError('processInventoryEventAndOrder', undefined, error);
  }
};

export const handleSerialization = async ({
  newProductId,
  productItem,
  tenantId,
}) => {
  if (stringNormalizer(productItem?.serialized) === TRUE_VALUE) {
    if (!productItem.serialNumbers || productItem.serialNumbers.length === 0) {
      return;
    }

    // Fetch ALL serial numbers in ONE query instead of N queries
    const existingSerials = await strapi.entityService.findMany(
      'api::inventory-serialize.inventory-serialize',
      {
        filters: {
          name: { $in: productItem.serialNumbers },
        },
        fields: ['id', 'name'],
      },
    );

    // Map existing serials by name for quick lookup
    const existingSerialMap = new Map(
      existingSerials.map((serial) => [serial.name, serial.id]),
    );

    // Separate serials into updates and creates
    const toUpdate = [];
    const toCreate = [];

    for (const serialNumber of productItem.serialNumbers) {
      const existingId = existingSerialMap.get(serialNumber);
      if (existingId) {
        toUpdate.push({ id: existingId, serialNumber });
      } else {
        toCreate.push(serialNumber);
      }
    }

    // Batch all updates and creates in parallel
    await Promise.all([
      ...toUpdate.map((item) =>
        strapi.entityService.update(
          'api::inventory-serialize.inventory-serialize',
          item.id,
          {
            data: { productInventoryItem: newProductId ?? null },
          },
        ),
      ),
      ...toCreate.map((serialNumber) =>
        strapi.entityService.create(
          'api::inventory-serialize.inventory-serialize',
          {
            data: {
              name: serialNumber,
              productInventoryItem: newProductId ?? null,
              tenant: tenantId ?? null,
            },
          },
        ),
      ),
    ]);
  }
};

export const handleProductItem = async ({
  productItem,
  productId,
  tenantId,
  userId,
  defaultPrice,
  costOfGoodsAccountId,
  cashPaymentMethodId,
}) => {
  try {
    const businessLocations = await strapi.entityService.findMany(
      'api::business-location.business-location',
      {
        filters: {
          businessLocationId: {
            $eq: productItem.businessLocationId,
          },
        },
        fields: ['id'],
      },
    );

    const businessLocationId = businessLocations?.[0]?.id;

    const createdInventoryItem = await strapi.entityService.create(
      'api::product-inventory-item.product-inventory-item',
      {
        data: {
          quantity: productItem?.quantity,
          product: productId,
          businessLocation: businessLocationId,
          tenant: tenantId,
          isSerializedInventory:
            stringNormalizer(productItem?.serialized) === TRUE_VALUE,
          _skipMeilisearchSync: true,
        },
      },
    );

    await handleSerialization({
      newProductId: createdInventoryItem.id,
      productItem,
      tenantId,
    });

    await processInventoryEventAndOrder('create', {
      productItem,
      createdInventoryItem,
      businessLocationId,
      productId,
      tenantId,
      userId,
      defaultPrice,
      costOfGoodsAccountId,
      cashPaymentMethodId,
    });

    return {
      ...createdInventoryItem,
      itemCost: +productItem.itemCost,
      businessLocationId: productItem.businessLocationId,
    };
  } catch (e) {
    handleError('handleProductItemTransaction', undefined, e);
    throw e;
  }
};

export const handleProductItemWithNoFetches = async ({
  productItem,
  productId,
  tenantId,
  userId,
  defaultPrice,
  isNegative,
  isActive,
  businessLocationEntities,
  costOfGoodsAccountId,
  cashPaymentMethodId,
}) => {
  try {
    const businessLocationId = businessLocationEntities.find(
      (entity) => entity.businessLocationId === productItem.businessLocationId,
    )?.id;

    const createdInventoryItem = await strapi.entityService.create(
      'api::product-inventory-item.product-inventory-item',
      {
        data: {
          quantity: productItem?.quantity,
          product: productId,
          businessLocation: businessLocationId,
          tenant: tenantId,
          isSerializedInventory:
            stringNormalizer(productItem?.serialized) === TRUE_VALUE,
          isNegativeCount: isNegative,
          active: isActive,
          _skipActiveStatusSet: true,
          _skipMeilisearchSync: true,
        },
      },
    );

    await handleSerialization({
      newProductId: createdInventoryItem.id,
      productItem,
      tenantId,
    });

    await processInventoryEventAndOrder('create', {
      productItem,
      createdInventoryItem,
      businessLocationId,
      productId,
      tenantId,
      userId,
      defaultPrice,
      costOfGoodsAccountId,
      cashPaymentMethodId,
    });

    return {
      ...createdInventoryItem,
      itemCost: +productItem.itemCost,
      businessLocationId: productItem.businessLocationId,
    };
  } catch (e) {
    handleError('handleProductItemTransaction', undefined, e);
    throw e;
  }
};
