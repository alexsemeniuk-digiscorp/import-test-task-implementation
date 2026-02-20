import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const stripeSubscriptionPlanConfig = new TenantResolverConfigFactory(
  'stripeSubscriptionPlan',
).buildResolversConfig();
