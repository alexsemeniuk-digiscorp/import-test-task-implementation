import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const dealTransactionResolversConfig = new TenantResolverConfigFactory(
  'dealTransaction',
).buildResolversConfig({
  'Query.linkedPaymentTxInfo': {
    auth: false,
  },
  'Query.paymentStatus': {
    auth: false,
  },
  'Mutation.updateDealTransactionClearent': {
    auth: false,
  },
});
