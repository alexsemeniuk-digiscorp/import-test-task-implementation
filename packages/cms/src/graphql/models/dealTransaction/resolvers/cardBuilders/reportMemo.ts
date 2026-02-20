import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateMemoInEventsTotalValue,
  calculateTotalRemainingQuantity,
  calculateUniqueProducts,
  getTenantFilter,
} from '../../helpers/helpers';

export const getReportMemoCardsInfo = async (
  userId,
  additionalFilters = {},
) => {
  const memoReportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const allProductsMemoEvents = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        memo: true,
        ...memoReportFilters,
        ...tenantFilter,
      },
      fields: ['remainingQuantity', 'itemCost'],
      populate: {
        productInventoryItem: {
          fields: ['id'],
          populate: {
            product: {
              fields: ['name'],
            },
          },
        },
      },
    },
  );

  const uniqueProductsCount = calculateUniqueProducts(allProductsMemoEvents);
  const totalRemainingQuantity = calculateTotalRemainingQuantity(
    allProductsMemoEvents,
  );
  const totalValue = calculateMemoInEventsTotalValue(allProductsMemoEvents);

  return [
    {
      id: 28,
      name: 'Number of Items',
      total: uniqueProductsCount,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 29,
      name: 'Remaining Units of Items',
      total: totalRemainingQuantity,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 30,
      name: 'Total Value',
      total: totalValue,
      cardImg: 3,
      type: 'transactions',
    },
  ];
};
