import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const subscriptionConfig = new TenantResolverConfigFactory(
  'usage',
).buildResolversConfig();
