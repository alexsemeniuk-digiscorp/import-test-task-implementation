import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const returnMethodResolversConfig = new TenantResolverConfigFactory(
  'returnMethod',
).buildResolversConfig();
