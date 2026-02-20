import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const transferOrderResolversConfig = new TenantResolverConfigFactory(
  'transferOrder',
).buildResolversConfig();
