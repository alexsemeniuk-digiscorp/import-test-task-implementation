import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const clearentResolversConfig = new TenantResolverConfigFactory(
  'clearent',
).buildResolversConfig();
