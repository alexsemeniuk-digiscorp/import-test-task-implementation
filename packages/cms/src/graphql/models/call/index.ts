import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const callResolversConfig = new TenantResolverConfigFactory(
  'call',
).buildResolversConfig();
