import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const documentPermissionResolversConfig =
  new TenantResolverConfigFactory('documentPermission').buildResolversConfig();
