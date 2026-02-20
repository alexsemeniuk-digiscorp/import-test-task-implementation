import {
  calculateSumOfDifferencesNumber,
  calculateTotalPaidNumber,
} from '../../dealTransaction/helpers/helpers';

export const calculateTotalSpentFromCustomer = (
  customer: any,
  dates?: Date[] | string | string[],
): number => {
  if (!customer?.dealTransactions || customer?.dealTransactions?.length === 0)
    return 0;

  const filteredTransactions = customer?.dealTransactions.filter(
    (transaction) => {
      if (transaction?.status === 'Cancelled') return false;

      if (transaction?.chartAccount?.type !== 'income') return false;

      if (dates && dates?.length === 2) {
        const [startDate, endDate] = dates;
        const txDate = new Date(
          transaction?.customCreationDate ?? transaction?.createdAt,
        );
        if (txDate < new Date(startDate) || txDate > new Date(endDate))
          return false;
      }

      return true;
    },
  );

  if (filteredTransactions && filteredTransactions.length === 0) return 0;

  return calculateTotalPaidNumber(filteredTransactions);
};

export const calculateAmountOwesFromCustomer = (
  customer: any,
  dates?: Date[] | string | string[],
): number => {
  if (!customer?.dealTransactions || customer?.dealTransactions?.length === 0)
    return 0;

  const filteredTransactions = customer?.dealTransactions.filter(
    (transaction) => {
      if (transaction?.status !== 'Open') return false;

      if (transaction?.chartAccount?.type !== 'income') return false;

      if (dates && dates?.length === 2) {
        const [startDate, endDate] = dates;
        const txDate = new Date(
          transaction?.customCreationDate ?? transaction?.createdAt,
        );
        if (txDate < new Date(startDate) || txDate > new Date(endDate))
          return false;
      }

      return true;
    },
  );

  if (filteredTransactions && filteredTransactions.length === 0) return 0;

  return calculateSumOfDifferencesNumber(filteredTransactions);
};
