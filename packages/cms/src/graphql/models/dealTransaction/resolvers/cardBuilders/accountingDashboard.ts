import {
  beginningOfLastMonth,
  beginningOfLastYear,
  beginningOfThisMonth,
  beginningOfThisYear,
  calculatePercentageChange,
  calculateSumOfDifferences,
  calculateTotalRevenue,
  currencyWithoutPointsFilter,
  currentDate,
  getLocationFilter,
  getTenantFilter,
  lastMonthSameDay,
  lastYearSameDay,
} from './../../helpers/helpers';

export const getAccountingDashboardCardsInfo = async (userId, locationId) => {
  const tenantFilter = await getTenantFilter(userId);
  const locationFilter = getLocationFilter(locationId);

  //year r and p
  const paidThisMonthIncome = await strapi.entityService.findMany(
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
            beginningOfThisMonth.toISOString(),
            currentDate.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status', 'customCreationDate'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  const paidLastMonthIncome = await strapi.entityService.findMany(
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
            beginningOfLastMonth.toISOString(),
            lastMonthSameDay.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status', 'customCreationDate'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  const paidThisYearIncome = await strapi.entityService.findMany(
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
            beginningOfThisYear.toISOString(),
            currentDate.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status', 'customCreationDate'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  const paidLastYearIncome = await strapi.entityService.findMany(
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
            lastYearSameDay.toISOString(),
            beginningOfLastYear.toISOString(),
          ],
        },
      },
      fields: ['summary', 'status', 'customCreationDate'],
      populate: {
        sellingOrder: {
          fields: ['total', 'tax'],
        },
      },
    },
  );

  //all income that are not paid
  const notPaidAccountReceivables = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        chartAccount: {
          type: 'income',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  //all cost that are not paid

  const notPaidAccountPayables = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        chartAccount: {
          type: 'cost',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  //1 card dashboard

  const totalAmountPaidThisMonthIncome =
    calculateTotalRevenue(paidThisMonthIncome);

  const totalAmountPaidLastMonthIncome =
    calculateTotalRevenue(paidLastMonthIncome);

  const progressRevenuePercentage = calculatePercentageChange(
    totalAmountPaidLastMonthIncome,
    totalAmountPaidThisMonthIncome,
  );

  //2 card dashboard

  const totalAmountPaidThisYearIncome =
    calculateTotalRevenue(paidThisYearIncome);
  const totalAmountPaidLastYearIncome =
    calculateTotalRevenue(paidLastYearIncome);

  const progressPayablePercentage = calculatePercentageChange(
    totalAmountPaidLastYearIncome,
    totalAmountPaidThisYearIncome,
  );

  //3 and 4 cards

  const totalAmountOpenReceivables = calculateSumOfDifferences(
    notPaidAccountReceivables,
  );

  const totalAmountOpenPayables = calculateSumOfDifferences(
    notPaidAccountPayables,
  );

  return [
    {
      id: 1,
      name: 'Monthly Revenue',
      description: 'vs Last Month',
      total: totalAmountPaidThisMonthIncome,
      percentage: progressRevenuePercentage,
      type: 'transactions',
      cardImg: 1,
      onCardClick: 'accounting-revenue-month',
    },
    {
      id: 2,
      name: 'Year to date Revenue',
      description: 'vs Last Year',
      total: totalAmountPaidThisYearIncome,
      type: 'transactions',
      percentage: progressPayablePercentage,
      cardImg: 2,
      onCardClick: 'accounting-revenue-year',
    },
    {
      id: 3,
      name: 'Account Receivables',
      total: totalAmountOpenReceivables,
      type: 'transactions',
      cardImg: 3,
      onCardClick: 'accounting-accounts-receivables',
    },
    {
      id: 4,
      name: 'Account Payables',
      total: totalAmountOpenPayables,
      type: 'transactions',
      cardImg: 2,
      onCardClick: 'accounting-accounts-payables',
    },
  ];
};
