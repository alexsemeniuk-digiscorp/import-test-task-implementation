import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const serviceSettingResolverConfig = new TenantResolverConfigFactory(
  'serviceSetting',
).buildResolversConfig();
