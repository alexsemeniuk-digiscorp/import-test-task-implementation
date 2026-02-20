import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const metalTypeResolversConfig = new TenantResolverConfigFactory(
  'metalType',
).buildResolversConfig();
