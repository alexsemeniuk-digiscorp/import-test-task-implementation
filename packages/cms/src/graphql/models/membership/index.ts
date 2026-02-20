import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const membershipResolversConfig = new TenantResolverConfigFactory(
  'membership',
).buildResolversConfig();
