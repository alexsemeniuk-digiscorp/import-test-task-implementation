import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const maintenanceEventResolversConfig = new TenantResolverConfigFactory(
  'maintenanceEvent',
).buildResolversConfig();
