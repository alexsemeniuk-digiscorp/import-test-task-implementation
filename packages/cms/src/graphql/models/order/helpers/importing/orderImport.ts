import { generateId, generateUUID } from '../../../../../utils/randomBytes';
import {
  ORDERS_IMPORT_IDENTIFIER,
  completedImportingData,
  spoiledImportingData,
} from './../../../../../api/redis/helpers/variables/importingVariables';
import { stringNormalizer } from './../../../../../graphql/helpers/formatter';
import { NexusGenEnums } from './../../../../../types/generated/graphql';
import { handleError } from './../../../../helpers/errors';
import { handleCompletedCreationError } from './../../../../helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../helpers/importingHelpers/redisHelpers';
import { TRUE_VALUE } from './../../../../helpers/importingHelpers/validators';
import { addPaidOffTransactions } from './../../../order/helpers/importing/utils/handleCompletedCreations/addPaidOffTransactions';
import { filterEmpty } from './../../../product/helpers/importing/productImport';
import { addPurchaseActivity } from './../importing/utils/handleCompletedCreations/addPurchaseActivity';
import { handleNonProductOrderItem } from './../importing/utils/handleCompletedCreations/handleNonProductOrderItem';
import { handleProductOrderItems } from './../importing/utils/handleCompletedCreations/handleProductOrderItems';

export const findCustomer = async (
  customerField: string,
  tenantId,
): Promise<{
  customerType: 'contact' | 'company' | 'none';
  customerId?: string;
}> => {
  try {
    const contact = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          email: stringNormalizer(customerField),
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id'],
        limit: 1,
      },
    );

    const company = await strapi.entityService.findMany(
      'api::company.company',
      {
        filters: {
          email: stringNormalizer(customerField),
          tenant: { id: { $eq: tenantId } },
        },
        fields: ['id'],
        limit: 1,
      },
    );

    const contactId = contact?.[0]?.id as string | undefined;
    const companyId = company?.[0]?.id as string | undefined;

    return {
      customerType: contactId ? 'contact' : companyId ? 'company' : 'none',
      customerId: contactId ?? companyId,
    };
  } catch (error) {
    console.error('Error finding customer:', error);
    return { customerType: 'none' };
  }
};

export const findExistingEntities = async (
  entity,
  filterKey,
  parsedProducts,
  tenantFilter,
) => {
  try {
    return strapi.entityService.findMany(entity, {
      filters: {
        [filterKey]: {
          $in: parsedProducts.map((product) => product.productId),
        },
        tenant: {
          id: {
            $eq: tenantFilter?.tenant,
          },
        },
      },
      fields: ['id', filterKey],
    });
  } catch (e) {
    handleError('findExistingEntities', undefined, e);
  }
};

export const mapEntitiesToIds = (entities, filterKey) => {
  try {
    return entities.map((entity) => ({
      id: entity.id,
      regexedId: entity[filterKey],
    }));
  } catch (e) {
    handleError('findExistingEntities', undefined, e);
  }
};

export const handleCompletedCreations = async (
  parsedOrder,
  tenantFilter,
  completedCreations,
  salesId,
  businessLocationId,
  revenueAccountId,
  cashPaymentMethodId,
  customerObj,
  inventoryArrays,
  createModeOn,
  imagesIds,
  isRedis,
  generatedRegex,
  spoiledCreations,
  userId,
  taxesMap: Map<string, any>,
  servicesMap: Map<string, any>,
  classesMap: Map<string, any>,
  membershipsMap: Map<string, any>,
  defaultTaxId,
) => {
  const {
    errors,
    localId,
    employee,
    paidOff,
    businessLocation,
    status,
    customerType,
    customer,
    deliveryMethod,
    images,
    layaway,
    ...otherValues
  } = parsedOrder || {};

  const customerId = customerObj?.customerId;
  const isContact = customerObj?.customerType === 'contact';
  const isCompany = customerObj?.customerType === 'company';
  const dueDate = otherValues?.dueDate
    ? new Date(otherValues?.dueDate)
    : undefined;

  const customDate = otherValues?.customCreationDate
    ? new Date(otherValues?.customCreationDate)
    : undefined;
  const tenant = tenantFilter?.tenant;

  try {
    const newOrder = await strapi.entityService.create('api::order.order', {
      data: {
        type:
          stringNormalizer(layaway) === TRUE_VALUE
            ? 'layaway'
            : ('sell' as NexusGenEnums['ENUM_ORDER_TYPE']),
        orderId: generateId(),
        status:
          (stringNormalizer(status) as NexusGenEnums['ENUM_ORDER_STATUS']) ||
          undefined,
        deliveryMethod: deliveryMethod || undefined,
        dueDate,
        tax: 0,
        sales: salesId || undefined,
        tenant,
        files: filterEmpty(imagesIds),
        customCreationDate: customDate,
        shippedDate: customDate,
        businessLocation: businessLocationId || undefined,
        contact: isContact ? customerId : undefined,
        company: isCompany ? customerId : undefined,
        orderVersion: createModeOn
          ? 'current'
          : ('historical' as NexusGenEnums['ENUM_ORDER_ORDERVERSION']),
        lastPayment:
          +paidOff > 0 ? (customDate ? customDate : new Date()) : undefined,
        _skipAfterCreateOrder: true,
        _skipAfterUpdateOrder: true,
        _skipMeilisearchSync: true,
      },
    });

    if (newOrder?.id) {
      await Promise.all([
        addPaidOffTransactions({
          paidOff,
          isCompany,
          isContact,
          customerId,
          orderId: newOrder?.id,
          dueDate,
          tenant,
          businessLocationId,
          customDate,
          revenueAccountId,
          cashPaymentMethodId,
        }),
        handleProductOrderItems(
          inventoryArrays.products,
          {
            businessLocationId,
            orderId: newOrder?.id,
            tenantId: tenantFilter?.tenant,
          },
          taxesMap,
          defaultTaxId,
        ),
        handleNonProductOrderItem(
          inventoryArrays.classes,
          { businessLocationId, orderId: newOrder?.id },
          {
            entityType: 'class',
            idField: 'classId',
            uid: 'api::class.class',
            orderItemUid: 'api::class-order-item.class-order-item',
            tenantId: tenantFilter?.tenant,
            userId,
          },
          taxesMap,
          classesMap,
          defaultTaxId,
        ),
        handleNonProductOrderItem(
          inventoryArrays.memberships,
          { businessLocationId, orderId: newOrder?.id },
          {
            entityType: 'membership',
            idField: 'membershipId',
            uid: 'api::membership.membership',
            orderItemUid: 'api::membership-order-item.membership-order-item',
            tenantId: tenantFilter?.tenant,
            userId,
          },
          taxesMap,
          membershipsMap,
          defaultTaxId,
        ),
        handleNonProductOrderItem(
          inventoryArrays.services,
          { businessLocationId, orderId: newOrder?.id },
          {
            entityType: 'service',
            idField: 'serviceId',
            uid: 'api::service.service',
            orderItemUid: 'api::service-order-item.service-order-item',
            tenantId: tenantFilter?.tenant,
            userId,
          },
          taxesMap,
          servicesMap,
          defaultTaxId,
        ),
        addPurchaseActivity({
          isCompany,
          isContact,
          customerId,
          dueDate,
          tenant,
          customDate,
          orderId: newOrder?.id,
          type: newOrder?.type,
          status: newOrder?.status,
          total: newOrder?.total,
        }),
      ]);
    }

    const completedCreationJson = JSON.stringify({
      orderId: newOrder?.orderId,
      ...parsedOrder,
    });

    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        ORDERS_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }

    completedCreations.push({ ...parsedOrder, orderId: newOrder?.orderId });
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedOrder,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedOrderCreations',
      importIdentifier: ORDERS_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};

export const handleSpoiledCreations = async (
  parsedOrder,
  isEmployeeValid,
  businessLocationId,
  customerField,
  spoiledCreations,
  customerObj,
  isImagesIds,
  isAllProductsExists,
  isAllTaxNamesExists,
  isEnoughItemQuantity,
  isSuitableSerialNumbers,
  isSerialNumbersAvailable,
  isRedis,
  generatedRegex,
  tenantFilter,
) => {
  const errors = [];
  if (!isEmployeeValid) {
    errors.push('No lead owner with such email found');
  }
  if (customerField && !customerObj.customerId) {
    errors.push('No customer with such email found');
  }
  if (!businessLocationId) {
    errors.push('No business location found');
  }
  if (!isImagesIds) {
    errors.push('Some of images ids not correct');
  }
  if (!isAllProductsExists) {
    errors.push('Some of product ids not correct');
  }
  if (!isAllTaxNamesExists) {
    errors.push('Some of tax names not correct');
  }
  if (!isEnoughItemQuantity) {
    errors.push("Some Products don't have enough quantity");
  }

  if (!isSuitableSerialNumbers) {
    errors.push('Some of none Products items has serial numbers');
  }
  if (!isSerialNumbersAvailable) {
    errors.push('Some of serial numbers are already in use');
  }

  const spoiledCreation = {
    ...parsedOrder,
    contact:
      customerObj.customerType === 'contact'
        ? customerObj.customerId
        : undefined,
    company:
      customerObj.customerType === 'company'
        ? customerObj.customerId
        : undefined,
    errors,
    localId: generateUUID(),
  };

  const spoiledCreationJson = JSON.stringify(spoiledCreation);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationJson,
      ORDERS_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};

export const getUniqueSet = (array, key) =>
  new Set(array?.map((item) => item[key]));

export const checkExistence = async (entity, key, valuesSet) => {
  const existingItems = await strapi.entityService.findMany(entity, {
    filters: {
      [key]: {
        $in: Array.from(valuesSet),
      },
    },
    fields: ['id'] as any,
  });
  return valuesSet.size > existingItems.length;
};

// Helper function to find or create a product inventory item
export const findOrCreateProductInventoryItem = async (
  parsedProduct,
  tenantFilter,
  businessLocationId,
) => {
  try {
    const productItems = await strapi.entityService.findMany(
      'api::product-inventory-item.product-inventory-item',
      {
        filters: {
          product: { productId: { $eq: parsedProduct.productId } },
          businessLocation: {
            id: { $eq: businessLocationId },
          },
          tenant: tenantFilter.tenant,
        },
        populate: { product: true, businessLocation: true, serializes: true },
        limit: 1,
      },
    );

    if (productItems.length) {
      return productItems[0];
    }

    const product = await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: { productId: { $eq: parsedProduct.productId } },
        fields: ['id'],
      },
    );

    return await strapi.entityService.create(
      'api::product-inventory-item.product-inventory-item',
      {
        data: {
          quantity: 0,
          lowQuantity: 0,
          minOrderQuantity: 0,
          maxQuantity: 0,
          businessLocation: businessLocationId,
          product: product?.[0]?.id,
          isSerializedInventory:
            parsedProduct?.serialNumbers &&
            parsedProduct?.serialNumbers?.length > 0,
          _skipMeilisearchSync: true,
        },
      },
    );
  } catch (e) {
    handleError('findOrCreateProductInventoryItem', undefined, e);
  }
};

export const createProductItemEntry = (productItem, parsedProduct) => {
  return {
    ...productItem,
    productQuantity: parsedProduct?.quantity,
    productTax: parsedProduct?.taxName,
    productPrice: parsedProduct?.price,
    productNote: parsedProduct?.note,
    productSerialNumbers: parsedProduct?.serialNumbers,
  };
};
