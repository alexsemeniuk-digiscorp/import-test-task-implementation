import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const tenantCreditHistoryConfig = new TenantResolverConfigFactory(
  'tenantCreditHistory',
).buildResolversConfig();
