import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const serviceResolversConfig = new TenantResolverConfigFactory(
  'service',
).buildResolversConfig();
