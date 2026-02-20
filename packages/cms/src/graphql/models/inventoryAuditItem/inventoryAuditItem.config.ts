import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const inventoryAuditItemResolverConfig = new TenantResolverConfigFactory(
  'inventoryAuditItem',
).buildResolversConfig();
