import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const stoneHueResolversConfig = new TenantResolverConfigFactory(
  'stoneHue',
).buildResolversConfig();
