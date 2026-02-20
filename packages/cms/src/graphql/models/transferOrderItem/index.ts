import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const transferOrderItemResolversConfig = new TenantResolverConfigFactory(
  'transferOrderItem',
).buildResolversConfig();
