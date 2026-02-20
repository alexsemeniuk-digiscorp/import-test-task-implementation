import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const stoneOriginResolversConfig = new TenantResolverConfigFactory(
  'stoneOrigin',
).buildResolversConfig();
