import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productBrandResolversConfig = new TenantResolverConfigFactory(
  'productBrand',
).buildResolversConfig();
