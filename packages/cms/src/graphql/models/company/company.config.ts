import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const companyResolversConfig = new TenantResolverConfigFactory(
  'company',
).buildResolversConfig();
