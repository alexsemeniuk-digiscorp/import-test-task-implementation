import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const resourceCountResolversConfig = new TenantResolverConfigFactory(
  'resourceCount',
).buildResolversConfig();
