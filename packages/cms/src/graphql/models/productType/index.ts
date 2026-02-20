import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productTypeResolversConfig = new TenantResolverConfigFactory(
  'productType',
).buildResolversConfig();
