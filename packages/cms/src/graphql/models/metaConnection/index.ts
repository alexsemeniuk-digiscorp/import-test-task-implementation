import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const metaConnectionResolversConfig = new TenantResolverConfigFactory(
  'metaConnection',
).buildResolversConfig();
