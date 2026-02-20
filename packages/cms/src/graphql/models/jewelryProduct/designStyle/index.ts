import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const designStyleResolversConfig = new TenantResolverConfigFactory(
  'designStyle',
).buildResolversConfig();
