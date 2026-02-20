import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contactResolversConfig = new TenantResolverConfigFactory(
  'contact',
).buildResolversConfig();
