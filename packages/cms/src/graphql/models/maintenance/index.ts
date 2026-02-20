import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const maintenanceResolversConfig = new TenantResolverConfigFactory(
  'maintenance',
).buildResolversConfig();
