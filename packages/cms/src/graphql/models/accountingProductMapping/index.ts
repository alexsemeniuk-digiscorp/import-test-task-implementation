import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const accountingProductMappingResolversConfig =
  new TenantResolverConfigFactory(
    'accountingProductMapping',
  ).buildResolversConfig();
