import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const classResolversConfig = new TenantResolverConfigFactory(
  'class',
).buildResolversConfig();
