import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const estimateResolversConfig = new TenantResolverConfigFactory(
  'estimate',
).buildResolversConfig();
