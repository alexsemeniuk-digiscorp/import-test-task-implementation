import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taxAuthorityResolversConfig = new TenantResolverConfigFactory(
  'taxAuthority',
).buildResolversConfig();
