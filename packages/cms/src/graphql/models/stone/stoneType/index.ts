import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const stoneTypeResolversConfig = new TenantResolverConfigFactory(
  'stoneType',
).buildResolversConfig();
