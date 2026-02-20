import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const reviewResolversConfig = new TenantResolverConfigFactory(
  'review',
).buildResolversConfig();
