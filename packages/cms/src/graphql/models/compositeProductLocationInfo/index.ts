import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const compositeProductLocationInfoResolversConfig =
  new TenantResolverConfigFactory(
    'compositeProductLocationInfo',
  ).buildResolversConfig();
