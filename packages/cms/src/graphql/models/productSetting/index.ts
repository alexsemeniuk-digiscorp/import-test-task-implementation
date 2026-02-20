import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productSettingResolverConfig = new TenantResolverConfigFactory(
  'productSetting',
).buildResolversConfig();
