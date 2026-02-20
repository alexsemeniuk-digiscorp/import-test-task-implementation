import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const questionResolversConfig = new TenantResolverConfigFactory(
  'question',
).buildResolversConfig();
