import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const linkTypeResolversConfig = new TenantResolverConfigFactory(
  'linkType',
).buildResolversConfig();
