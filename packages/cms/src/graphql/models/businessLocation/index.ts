import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const businessLocationResolversConfig = new TenantResolverConfigFactory(
  'businessLocation',
).buildResolversConfig();
