import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const resourceResolversConfig = new TenantResolverConfigFactory(
  'resource',
).buildResolversConfig();
