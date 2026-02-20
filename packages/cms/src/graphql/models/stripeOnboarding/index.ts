import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const stripeOnboardingConfig = new TenantResolverConfigFactory(
  'stripeOnboarding',
).buildResolversConfig();
