import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const websiteResolversConfig = new TenantResolverConfigFactory(
  'website',
).buildResolversConfig();
