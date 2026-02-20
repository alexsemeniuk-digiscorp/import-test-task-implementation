import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productGroupAttributeResolversConfig =
  new TenantResolverConfigFactory(
    'productGroupAttribute',
  ).buildResolversConfig();
