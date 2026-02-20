import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const strandResolversConfig = new TenantResolverConfigFactory(
  'strand',
).buildResolversConfig();
