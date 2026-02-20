import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const productGroupResolversConfig = new TenantResolverConfigFactory(
  'productGroup',
).buildResolversConfig();
