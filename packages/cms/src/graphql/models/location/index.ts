import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const locationResolversConfig = new TenantResolverConfigFactory(
  'location',
).buildResolversConfig();
