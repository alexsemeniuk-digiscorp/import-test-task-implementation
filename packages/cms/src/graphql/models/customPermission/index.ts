import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const customPermissionResolversConfig = new TenantResolverConfigFactory(
  'customPermission',
).buildResolversConfig();
