import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const globalSearchResolversConfig = new TenantResolverConfigFactory(
  'globalSearch',
).buildResolversConfig();
