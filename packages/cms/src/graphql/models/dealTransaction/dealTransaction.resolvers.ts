import { createDealTransactionCustomer } from './resolvers/createDealTransactionCustomer';
import {
  cardTotals,
  chartsTimeTotalsWithLength,
  createDealTransactionInventoryShrinkage,
  getSavedCards,
  handlePaymentLinkRequest,
  linkedPaymentTxInfo,
  removeCard,
} from './resolvers/index';
import { updateDealTransactionClearent } from './resolvers/updateDealTransactionClearent';

export const DealTransactionQueries = {
  cardTotals,
  chartsTimeTotalsWithLength,
  getSavedCards,
  linkedPaymentTxInfo,
};

export const DealTransactionMutation = {
  handlePaymentLinkRequest,
  removeCard,
  createDealTransactionCustomer,
  createDealTransactionInventoryShrinkage,
  updateDealTransactionClearent,
};
