import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const salesCommissionResolversConfig = new TenantResolverConfigFactory(
  'gmCommission',
).buildResolversConfig();
