import {
  beginningOfToday,
  beginningOfTomorrow,
  beginningOfYesterday,
  calculatePercentageChange,
  calculateTotalRevenue,
  currencyWithoutPointsFilter,
  getLocationFilter,
  getTenantFilter,
  orderRevenueRentTypeFilter,
} from './../../helpers/helpers';

export const getMainDashboardCardsInfo = async (userId, locationId) => {
  const tenantFilter = await getTenantFilter(userId);
  const locationFilter = getLocationFilter(locationId);

  const incomePaidToday = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...currencyWithoutPointsFilter,
        chartAccount: {
          type: 'income',
        },
        status: { $in: ['Paid', 'Refunded'] },
        customCreationDate: {
          $between: [
            beginningOfToday.toISOString(),
            beginningOfTomorrow.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  const incomePaidYesterday = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...currencyWithoutPointsFilter,
        chartAccount: {
          type: 'income',
        },
        status: { $in: ['Paid', 'Refunded'] },
        customCreationDate: {
          $between: [
            beginningOfYesterday.toISOString(),
            beginningOfToday.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  console.log('incomePaidToday: ', incomePaidToday);
  console.log('incomePaidYesterday: ', incomePaidYesterday);

  const totalAmountPaidThisDayIncome = calculateTotalRevenue(incomePaidToday);

  const totalAmountPaidYesterdayIncome =
    calculateTotalRevenue(incomePaidYesterday);

  const progressRevenuePercentage = calculatePercentageChange(
    totalAmountPaidYesterdayIncome,
    totalAmountPaidThisDayIncome,
  );

  const todaysOrders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      ...tenantFilter,
      ...locationFilter,
      ...orderRevenueRentTypeFilter,
      customCreationDate: {
        $between: [
          beginningOfToday.toISOString(),
          beginningOfTomorrow.toISOString(),
        ],
      },
    },
    fields: ['id'],
  });

  const yesterdaysOrders = await strapi.entityService.findMany(
    'api::order.order',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...orderRevenueRentTypeFilter,
        customCreationDate: {
          $between: [
            beginningOfYesterday.toISOString(),
            beginningOfToday.toISOString(),
          ],
        },
      },
      fields: ['id'],
    },
  );

  console.log('todaysOrders: ', todaysOrders);
  console.log('yesterdaysOrders: ', yesterdaysOrders);

  const todaysAmount = todaysOrders?.length;
  const yesterdaysAmount = yesterdaysOrders?.length;

  const progressOrdersPercentage = calculatePercentageChange(
    yesterdaysAmount,
    todaysAmount,
  );

  const users = await strapi.entityService.findMany(
    'plugin::users-permissions.user',
    {
      filters: {
        ...tenantFilter,
        role: {
          name: {
            $ne: 'Customer',
          },
        },
      },
      fields: ['id'],
    },
  );

  const employeesCount = users?.length ?? 0;

  // TODO: Valentyn K. - change static total in card with id: 11 to dynamic when HR module is ready
  return [
    {
      id: 9,
      name: 'Daily Revenue',
      total: totalAmountPaidThisDayIncome,
      percentage: progressRevenuePercentage,
      description: 'vs Yesterday',
      type: 'transactions',
      cardImg: 1,
      onCardClick: 'accounting-transactions-today',
    },
    {
      id: 10,
      name: 'Daily Orders',
      total: todaysAmount,
      percentage: progressOrdersPercentage,
      description: 'vs Yesterday',
      type: 'orders',
      cardImg: 2,
      onCardClick: 'selling-order-management',
    },
    {
      id: 11,
      name: 'Employees on shift',
      total: 0,
      percentage: employeesCount,
      description: 'Total Employees',
      type: 'employees',
      cardImg: 3,
      onCardClick: 'hr-dashboard',
    },
  ];
};
