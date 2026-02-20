import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const countryResolversConfig = new TenantResolverConfigFactory(
  'country',
).buildResolversConfig();
