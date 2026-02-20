import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const timelineConnectionResolversConfig =
  new TenantResolverConfigFactory('timelineConnection').buildResolversConfig();
