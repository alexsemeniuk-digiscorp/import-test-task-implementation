import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const inventoryAuditResolverConfig = new TenantResolverConfigFactory(
  'inventoryAudit',
).buildResolversConfig();
