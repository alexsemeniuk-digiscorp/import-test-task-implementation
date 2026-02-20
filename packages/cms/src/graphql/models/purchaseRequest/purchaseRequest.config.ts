import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const purchaseRequestResolversConfig = new TenantResolverConfigFactory(
  'purchaseRequest',
).buildResolversConfig();
