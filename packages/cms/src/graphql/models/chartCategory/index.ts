import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const chartCategoryResolversConfig = new TenantResolverConfigFactory(
  'chartCategory',
).buildResolversConfig();
