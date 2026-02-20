import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const dealTransactionResolversConfig = new TenantResolverConfigFactory(
  'taxReport',
).buildResolversConfig();
