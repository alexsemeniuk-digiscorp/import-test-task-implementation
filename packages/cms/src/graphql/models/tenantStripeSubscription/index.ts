import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const tenantStripeSubscriptionConfig = new TenantResolverConfigFactory(
  'tenantStripeSubscription',
).buildResolversConfig();
