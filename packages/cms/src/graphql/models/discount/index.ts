import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const discountResolversConfig = new TenantResolverConfigFactory(
  'discount',
).buildResolversConfig();
