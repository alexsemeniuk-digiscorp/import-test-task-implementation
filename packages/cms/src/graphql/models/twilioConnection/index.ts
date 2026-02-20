import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const twilioConnectionResolversConfig = new TenantResolverConfigFactory(
  'twilioConnection',
).buildResolversConfig();
