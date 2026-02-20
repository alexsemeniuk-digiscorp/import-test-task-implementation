import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateOrdersData,
  getTenantFilter,
  orderRevenueTypeFilter,
} from '../../helpers/helpers';

export const getReportSalesByItemCategoryCardsInfo = async (
  userId,
  additionalFilters = {},
) => {
  const salesByItemCategoryReportFilters =
    addDollarToFilterKeys(additionalFilters);
  const tenantFilter = await getTenantFilter(userId);

  const orders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      status: {
        $ne: 'draft',
      },
      ...tenantFilter,
      ...orderRevenueTypeFilter,
      ...salesByItemCategoryReportFilters,
    },
    fields: ['subTotal'],
    populate: {
      products: {
        fields: ['quantity', 'isCompositeProductItem'],
      },
      compositeProducts: {
        fields: ['quantity'],
      },
      services: {
        fields: ['quantity'],
      },
      memberships: {
        fields: ['quantity'],
      },
      classes: {
        fields: ['quantity'],
      },
    },
  });

  const { ordersSubTotal, numberOfItemsSold, itemAverageRevenue } =
    calculateOrdersData(orders);

  return [
    {
      id: 37,
      name: 'Total Units Sold',
      total: numberOfItemsSold,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 38,
      name: 'Total Revenue Generated',
      total: ordersSubTotal,
      cardImg: 2,
      type: 'transactions',
    },
    {
      id: 39,
      name: 'Unit Average Revenue',
      total: itemAverageRevenue,
      cardImg: 3,
      type: 'transactions',
    },
  ];
};
