import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const companySettingResolverConfig = new TenantResolverConfigFactory(
  'companySetting',
).buildResolversConfig();
