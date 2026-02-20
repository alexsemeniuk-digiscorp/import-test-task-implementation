import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const timeTrackerResolversConfig = new TenantResolverConfigFactory(
  'timeTracker',
).buildResolversConfig();
