import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const inventoryAdjustmentItemResolversConfig =
  new TenantResolverConfigFactory(
    'inventoryAdjustmentItem',
  ).buildResolversConfig();
