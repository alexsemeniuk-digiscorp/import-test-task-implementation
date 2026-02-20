import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const salesItemReportResolversConfig = new TenantResolverConfigFactory(
  'salesItemReport',
).buildResolversConfig();
