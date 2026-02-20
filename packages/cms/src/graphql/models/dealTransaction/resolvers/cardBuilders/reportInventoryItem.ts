import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateAverageAge,
  calculateItemRecordsTotalCostPrice,
  calculateItemRecordsTotalSalePrice,
  getTenantFilter,
} from '../../helpers/helpers';

export const getReportInventoryItemCardsInfo = async (
  userId,
  additionalFilters = {},
) => {
  const inventoryItemReportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const getCurrentUnitsCount = strapi.entityService.count(
    'api::invt-itm-record.invt-itm-record',
    {
      filters: {
        soldDate: {
          $eq: null,
        },
        ...inventoryItemReportFilters,
        ...tenantFilter,
      },
    },
  );

  const currentProductInventoryItemRecords =
    await strapi.entityService.findMany(
      'api::invt-itm-record.invt-itm-record',
      {
        filters: {
          soldDate: {
            $eq: null,
          },
          ...inventoryItemReportFilters,
          ...tenantFilter,
        },
        fields: ['age'],
        populate: {
          productInventoryItemEvent: {
            fields: ['id', 'itemCost', 'remainingQuantity'],
          },
          productInventoryItem: {
            fields: ['price', 'quantity'],
            populate: {
              product: {
                fields: ['defaultPrice', 'multiplier'],
              },
            },
          },
        },
      },
    );

  const allProductInventoryItemRecords = await strapi.entityService.findMany(
    'api::invt-itm-record.invt-itm-record',
    {
      filters: {
        ...inventoryItemReportFilters,
        ...tenantFilter,
      },
      fields: ['age'],
      populate: {
        productInventoryItemEvent: {
          fields: ['id', 'itemCost', 'remainingQuantity'],
        },
        productInventoryItem: {
          fields: ['price', 'quantity'],
          populate: {
            product: {
              fields: ['defaultPrice', 'multiplier'],
            },
          },
        },
      },
    },
  );

  const totalCostPrice = calculateItemRecordsTotalCostPrice(
    currentProductInventoryItemRecords,
  );
  const totalSalePrice = calculateItemRecordsTotalSalePrice(
    currentProductInventoryItemRecords,
  );
  const currentAverageAge = calculateAverageAge(
    currentProductInventoryItemRecords,
  );
  const averageAge = calculateAverageAge(allProductInventoryItemRecords);

  return [
    {
      id: 33,
      name: 'Units of Items',
      total: getCurrentUnitsCount,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 34,
      name: 'Cost Value',
      total: totalCostPrice,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 35,
      name: 'Sale Value',
      total: totalSalePrice,
      cardImg: 3,
      type: 'transactions',
    },
    {
      id: 36,
      name: 'Average Days Of Current Inventory',
      total: currentAverageAge,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 37,
      name: 'Average Days In Inventory',
      total: averageAge,
      cardImg: 2,
      type: 'employees',
    },
  ];
};
