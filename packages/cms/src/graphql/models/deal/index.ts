import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const dealResolversConfig = new TenantResolverConfigFactory(
  'deal',
).buildResolversConfig();
