import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const resourceInventoryItemResolversConfig =
  new TenantResolverConfigFactory(
    'resourceInventoryItem',
  ).buildResolversConfig();
