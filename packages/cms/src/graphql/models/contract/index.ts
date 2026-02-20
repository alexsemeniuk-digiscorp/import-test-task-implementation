import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contractResolversConfig = new TenantResolverConfigFactory(
  'contract',
).buildResolversConfig();
