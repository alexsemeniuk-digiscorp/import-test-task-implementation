import {
  beginningOfTomorrow,
  getLocationFilter,
  getPercentageDifference,
  getStartOfWeek,
  getTenantFilter,
  getWeekRange,
  orderRevenueRentTypeFilter,
} from './../../helpers/helpers';

export const getSellingCardsInfo = async (userId, locationId) => {
  const startOfWeek = getStartOfWeek();
  const endOfSamePeriodInPrevWeek = getWeekRange();
  const startOfPreviousWeek = getStartOfWeek(endOfSamePeriodInPrevWeek);
  const tenantFilter = await getTenantFilter(userId);
  const locationFilter = getLocationFilter(locationId);

  const currentWeekOrders = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        customCreationDate: {
          $between: [
            startOfWeek.toISOString(),
            beginningOfTomorrow.toISOString(),
          ],
        },
        ...locationFilter,
        ...tenantFilter,
        ...orderRevenueRentTypeFilter,
      },
      fields: ['status', 'total'],
    },
  );
  const prevWeekOrders = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        customCreationDate: {
          $between: [
            startOfPreviousWeek.toISOString(),
            endOfSamePeriodInPrevWeek.toISOString(),
          ],
        },
        ...tenantFilter,
        ...orderRevenueRentTypeFilter,
      },
      fields: ['status', 'total'],
    },
  );

  const currentWeekSales = currentWeekOrders
    ?.filter((order) => order?.status === 'shipped')
    .reduce((acc, item) => acc + item.total, 0);
  const prevWeekSales = prevWeekOrders
    ?.filter((order) => order?.status === 'shipped')
    .reduce((acc, item) => acc + item.total, 0);

  const currentWeekActiveOrders = currentWeekOrders?.filter(
    (order) => order.status !== 'shipped',
  );
  const prevWeekActiveOrders = prevWeekOrders?.filter(
    (order) => order.status !== 'shipped',
  );

  const currentWeekAverageOrder = currentWeekOrders.length
    ? currentWeekOrders.reduce((acc, order) => acc + order.total, 0) /
      currentWeekOrders.length
    : 0;
  const prevWeekAverageOrder = prevWeekOrders.length
    ? prevWeekOrders.reduce((acc, order) => acc + order.total, 0) /
      prevWeekOrders.length
    : 0;

  const totalOrdersDiff = getPercentageDifference(
    +prevWeekOrders?.length,
    +currentWeekOrders?.length,
  );
  const totalSalesDiff = getPercentageDifference(
    Number(prevWeekSales),
    Number(currentWeekSales),
  );
  const activeOrdersDiff = getPercentageDifference(
    Number(prevWeekActiveOrders.length),
    Number(currentWeekActiveOrders.length),
  );
  const orderAverageDiff = getPercentageDifference(
    prevWeekAverageOrder,
    currentWeekAverageOrder,
  );

  return [
    {
      id: 12,
      name: 'Total Orders',
      total: Number(currentWeekOrders?.length),
      percentage: totalOrdersDiff,
      description: 'vs Last Week',
      cardImg: 1,
    },
    {
      id: 13,
      name: 'Total Sales',
      total: Number(currentWeekSales),
      percentage: totalSalesDiff,
      description: 'vs Last Week',
      cardImg: 2,
      type: 'currency',
    },
    {
      id: 14,
      name: 'Active Order',
      total: Number(currentWeekActiveOrders.length),
      percentage: activeOrdersDiff,
      description: 'vs Last Week',
      cardImg: 3,
    },
    {
      id: 15,
      name: 'Average Order Size',
      total: currentWeekAverageOrder,
      percentage: orderAverageDiff,
      description: 'vs Last Week',
      cardImg: 2,
      type: 'currency',
    },
  ];
};
