import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const activityResolversConfig = new TenantResolverConfigFactory(
  'article',
).buildResolversConfig();
