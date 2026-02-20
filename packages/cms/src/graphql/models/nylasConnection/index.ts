import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const nylasConnectionResolversConfig = new TenantResolverConfigFactory(
  'nylasConnection',
).buildResolversConfig();
