import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const compositeProductResolversConfig = new TenantResolverConfigFactory(
  'compositeProduct',
).buildResolversConfig();
