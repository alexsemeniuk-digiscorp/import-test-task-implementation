import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const stoneResolversConfig = new TenantResolverConfigFactory(
  'stone',
).buildResolversConfig();
