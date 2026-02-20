import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const rentableDataResolversConfig = new TenantResolverConfigFactory(
  'rentableData',
).buildResolversConfig();
