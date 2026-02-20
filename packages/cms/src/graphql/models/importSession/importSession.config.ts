import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const importSessionResolversConfig = new TenantResolverConfigFactory(
  'importingSession',
).buildResolversConfig();
