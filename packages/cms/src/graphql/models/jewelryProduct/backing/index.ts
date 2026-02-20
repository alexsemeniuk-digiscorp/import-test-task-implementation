import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const backingResolversConfig = new TenantResolverConfigFactory(
  'backing',
).buildResolversConfig();
