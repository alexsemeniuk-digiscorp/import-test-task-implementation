import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const paymentMethodResolversConfig = new TenantResolverConfigFactory(
  'paymentMethod',
).buildResolversConfig();
