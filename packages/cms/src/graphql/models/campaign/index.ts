import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const campaignResolversConfig = new TenantResolverConfigFactory(
  'campaign',
).buildResolversConfig();
