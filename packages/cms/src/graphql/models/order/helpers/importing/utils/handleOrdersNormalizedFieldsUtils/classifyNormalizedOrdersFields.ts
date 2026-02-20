import { findExistingEntities, mapEntitiesToIds } from './../../orderImport';

const ensureArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};

export const classifyNormalizedOrdersFields = async (
  parsedOrder,
  tenantFilter,
) => {
  let productIds = [];
  let serviceIds = [];
  let classIds = [];
  let membershipIds = [];

  const productsIdsSet = new Set(
    ensureArray(parsedOrder?.products?.map((product) => product.productId)),
  );

  const [
    existingProductIds,
    existingServices,
    existingClasses,
    existingMemberships,
  ] = await Promise.all([
    findExistingEntities(
      'api::product.product',
      'productId',
      parsedOrder?.products,
      tenantFilter,
    ),
    findExistingEntities(
      'api::service.service',
      'serviceId',
      parsedOrder?.products,
      tenantFilter,
    ),
    findExistingEntities(
      'api::class.class',
      'classId',
      parsedOrder?.products,
      tenantFilter,
    ),
    findExistingEntities(
      'api::membership.membership',
      'membershipId',
      parsedOrder?.products,
      tenantFilter,
    ),
  ]);

  productIds = mapEntitiesToIds(existingProductIds, 'productId');
  serviceIds = mapEntitiesToIds(existingServices, 'serviceId');
  classIds = mapEntitiesToIds(existingClasses, 'classId');
  membershipIds = mapEntitiesToIds(existingMemberships, 'membershipId');

  const allExistingItems = [
    ...ensureArray(existingProductIds),
    ...ensureArray(existingServices),
    ...ensureArray(existingClasses),
    ...ensureArray(existingMemberships),
  ];

  const isAllProductsExists =
    Array.from(productsIdsSet).filter((item) => item !== '').length ===
    allExistingItems.length;

  const getInventoryType = (productId) => {
    if (productIds.find((product) => product.regexedId === productId)) {
      return 'product';
    }
    if (serviceIds.find((service) => service.regexedId === productId)) {
      return 'service';
    }
    if (classIds.find((classObj) => classObj.regexedId === productId)) {
      return 'class';
    }
    if (
      membershipIds.find((membership) => membership.regexedId === productId)
    ) {
      return 'membership';
    }
    return null;
  };

  parsedOrder.products = parsedOrder.products.map((product) => {
    return {
      ...product,
      inventoryType: getInventoryType(product.productId),
    };
  });

  return { isAllProductsExists, getInventoryType };
};
