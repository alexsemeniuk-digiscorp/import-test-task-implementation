import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const dealSettingResolverConfig = new TenantResolverConfigFactory(
  'dealSetting',
).buildResolversConfig();
