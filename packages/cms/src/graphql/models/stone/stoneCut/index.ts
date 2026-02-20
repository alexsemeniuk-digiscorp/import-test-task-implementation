import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const stoneCutResolversConfig = new TenantResolverConfigFactory(
  'stoneCut',
).buildResolversConfig();
