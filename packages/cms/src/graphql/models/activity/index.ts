import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const activityResolversConfig = new TenantResolverConfigFactory(
  'activity',
).buildResolversConfig();
