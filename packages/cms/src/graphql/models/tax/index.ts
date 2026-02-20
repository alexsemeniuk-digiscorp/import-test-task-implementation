import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taxResolversConfig = new TenantResolverConfigFactory(
  'tax',
).buildResolversConfig();
