import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  calculateSumOfDifferences,
  currentDate,
  getLocationFilter,
  getTenantFilter,
} from './../../helpers/helpers';

export const getAccountingDealTransactionsCardsInfo = async (
  userId,
  locationId,
  additionalFilters = {},
) => {
  const tenantFilter = await getTenantFilter(userId);
  const locationFilter = getLocationFilter(locationId);
  const transactionFilters = addDollarToFilterKeys(additionalFilters);

  const openAccountReceivables = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...transactionFilters,
        chartAccount: {
          type: 'income',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  const openAccountPayables = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...transactionFilters,
        chartAccount: {
          type: 'cost',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  const overdueRecieveblesTransactions = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...transactionFilters,
        customCreationDate: { $lt: currentDate },
        chartAccount: {
          type: 'income',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  const overduePayablesTransactions = await strapi.entityService.findMany(
    'api::deal-transaction.deal-transaction',
    {
      filters: {
        ...tenantFilter,
        ...locationFilter,
        ...transactionFilters,
        customCreationDate: { $lt: currentDate },
        chartAccount: {
          type: 'cost',
        },
        status: 'Open',
      },
      fields: ['summary', 'paid'],
    },
  );

  const totalAmountReceivables = calculateSumOfDifferences(
    openAccountReceivables,
  );
  const totalAmountPayables = calculateSumOfDifferences(openAccountPayables);

  const totalOverdueReceivablesSum = calculateSumOfDifferences(
    overdueRecieveblesTransactions,
  );
  const totalOverduePayablesSum = calculateSumOfDifferences(
    overduePayablesTransactions,
  );

  return [
    {
      id: 5,
      name: 'Account Receivables',
      total: totalAmountReceivables,
      type: 'transactions',
      cardImg: 1,
      onCardClick: 'accounting-accounts-receivables',
    },
    {
      id: 6,
      name: 'Account Payables',
      total: totalAmountPayables,
      type: 'transactions',
      cardImg: 2,
      onCardClick: 'accounting-accounts-payables',
    },
    {
      id: 7,
      name: 'Overdue Receivables',
      total: totalOverdueReceivablesSum,
      type: 'transactions',
      cardImg: 3,
      onCardClick: 'accounting-overdue-receivables',
    },
    {
      id: 8,
      name: 'Overdue Payables',
      total: totalOverduePayablesSum,
      type: 'transactions',
      cardImg: 2,
      onCardClick: 'accounting-overdue-payables',
    },
  ];
};
