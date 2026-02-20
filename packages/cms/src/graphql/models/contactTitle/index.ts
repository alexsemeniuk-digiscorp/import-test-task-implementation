import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contactTitleResolversConfig = new TenantResolverConfigFactory(
  'contactTitle',
).buildResolversConfig();
