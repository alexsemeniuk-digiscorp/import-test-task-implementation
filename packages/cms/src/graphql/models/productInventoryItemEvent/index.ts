import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productInventoryItemEventResolversConfig =
  new TenantResolverConfigFactory(
    'productInventoryItemEvent',
  ).buildResolversConfig();
