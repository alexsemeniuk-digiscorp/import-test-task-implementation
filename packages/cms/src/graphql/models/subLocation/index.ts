import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const subLocationResolversConfig = new TenantResolverConfigFactory(
  'sublocation',
).buildResolversConfig();
