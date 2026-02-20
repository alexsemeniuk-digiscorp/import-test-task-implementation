import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const returnResolversConfig = new TenantResolverConfigFactory(
  'return',
).buildResolversConfig();
