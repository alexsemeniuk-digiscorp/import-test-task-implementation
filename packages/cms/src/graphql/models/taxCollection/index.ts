import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taxCollectionResolversConfig = new TenantResolverConfigFactory(
  'taxCollection',
).buildResolversConfig();
