import {
  buildInventoryReportFilters,
  calculateProductInventoryItemsTotalSalePrice,
} from '../../helpers/helpers';

export const getReportInventoryCardsInfo = async (
  userId,
  additionalFilters = {},
) => {
  const {
    tenantFilter,
    productFilter,
    productInventoryItemFilter,
    productInventoryItemEventFilter,
  } = await buildInventoryReportFilters(userId, additionalFilters);

  const allProductsCount = strapi.entityService.count('api::product.product', {
    filters: {
      ...tenantFilter,
      ...productFilter,
    },
  });

  const productItemsService = strapi.service(
    'api::product-inventory-item.product-inventory-item',
  );

  const getUnitsCount = await productItemsService.getAllProductUnitsItems(
    tenantFilter?.tenant,
    productInventoryItemFilter,
  );

  const allReceiveEvents = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        eventType: {
          $eq: 'receive',
        },
        ...tenantFilter,
        ...productInventoryItemEventFilter,
      },
      fields: ['itemCost', 'remainingQuantity'],
    },
  );

  const totalCostPrice = allReceiveEvents.reduce((total, receiveEvent) => {
    return total + receiveEvent?.itemCost * receiveEvent?.remainingQuantity;
  }, 0);

  const allProductInventoryItems = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        ...tenantFilter,
        ...productInventoryItemFilter,
      },
      fields: ['price', 'quantity'],
      populate: {
        product: {
          fields: ['defaultPrice', 'multiplier'],
        },
        product_inventory_item_events: {
          fields: ['itemCost'],
        },
      },
    },
  );

  const totalSalePrice = calculateProductInventoryItemsTotalSalePrice(
    allProductInventoryItems,
  );

  return [
    {
      id: 20,
      name: 'Number of Items',
      total: await allProductsCount,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 21,
      name: 'Units of Items',
      total: getUnitsCount,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 22,
      name: 'Cost Value',
      total: totalCostPrice,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 23,
      name: 'Sale Value',
      total: totalSalePrice,
      cardImg: 1,
      type: 'transactions',
    },
  ];
};
