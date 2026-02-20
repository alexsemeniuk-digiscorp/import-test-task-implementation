import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productAttributeResolversConfig = new TenantResolverConfigFactory(
  'productAttribute',
).buildResolversConfig();
