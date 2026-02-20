import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const fileItemResolversConfig = new TenantResolverConfigFactory(
  'fileItem',
).buildResolversConfig();
