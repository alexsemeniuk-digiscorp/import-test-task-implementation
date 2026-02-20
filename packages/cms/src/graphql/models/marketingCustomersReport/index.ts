import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const marketingCustomersReportResolversConfig =
  new TenantResolverConfigFactory(
    'marketingCustomersReport',
  ).buildResolversConfig();
