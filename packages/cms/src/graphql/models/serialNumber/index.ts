import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const serializedResolversConfig = new TenantResolverConfigFactory(
  'inventorySerialize',
).buildResolversConfig();
