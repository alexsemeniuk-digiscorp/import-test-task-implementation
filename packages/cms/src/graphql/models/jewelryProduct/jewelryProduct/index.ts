import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const jewelryProductResolversConfig = new TenantResolverConfigFactory(
  'jewelryProduct',
).buildResolversConfig();
