import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const leadResolversConfig = new TenantResolverConfigFactory(
  'lead',
).buildResolversConfig();
