import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contactSettingResolverConfig = new TenantResolverConfigFactory(
  'contactSetting',
).buildResolversConfig();
