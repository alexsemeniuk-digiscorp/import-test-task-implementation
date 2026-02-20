import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const orderResolversConfig = new TenantResolverConfigFactory(
  'order',
).buildResolversConfig({
  'Mutation.orderPayment': {
    auth: false,
  },
  'Mutation.updateStripePaymentMethodType': {
    auth: false,
  },
});
