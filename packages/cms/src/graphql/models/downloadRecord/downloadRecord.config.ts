import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const downloadRecordResolversConfig = new TenantResolverConfigFactory(
  'downloadRecord',
).buildResolversConfig();
