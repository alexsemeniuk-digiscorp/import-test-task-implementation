import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateMemoOutItemsTotal,
  calculateMemoOutItemsTotalValue,
  calculateMemoOutProductsAmount,
  getTenantFilter,
  orderRevenueRentTypeArray,
} from '../../helpers/helpers';

export const getReportMemoOutCardsInfo = async (
  userId,
  additionalFilters = {},
) => {
  const memoOutReportFilters = addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const productOrderItems = await strapi.entityService.findMany(
    'api::product-order-item.product-order-item',
    {
      filters: {
        order: {
          $and: [{ memo: { $ne: null } }, { memo: { $ne: 0 } }],
          status: {
            $ne: 'draft',
          },
          type: {
            $in: orderRevenueRentTypeArray,
          },
          ...tenantFilter,
        },
        ...memoOutReportFilters,
      },
      fields: ['quantity', 'price'],
    },
  );

  const productsAmount = calculateMemoOutProductsAmount(productOrderItems);
  const totalOrderItemsQuantity = calculateMemoOutItemsTotal(productOrderItems);
  const totalValue = calculateMemoOutItemsTotalValue(productOrderItems);

  return [
    {
      id: 31,
      name: 'Number of Items',
      total: productsAmount,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 32,
      name: 'Remaining Units of Items',
      total: totalOrderItemsQuantity,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 33,
      name: 'Total Value',
      total: totalValue,
      cardImg: 3,
      type: 'transactions',
    },
  ];
};
