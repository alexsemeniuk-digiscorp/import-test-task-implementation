import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const timePeriodResolversConfig = new TenantResolverConfigFactory(
  'timePeriod',
).buildResolversConfig();
