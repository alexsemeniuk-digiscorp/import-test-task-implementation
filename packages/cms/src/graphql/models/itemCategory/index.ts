import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const itemCategoryResolversConfig = new TenantResolverConfigFactory(
  'itemCategory',
).buildResolversConfig();
