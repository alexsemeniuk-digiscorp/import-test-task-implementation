import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const ecommerceConnectionResolversConfig =
  new TenantResolverConfigFactory('ecommerceDetails').buildResolversConfig();
