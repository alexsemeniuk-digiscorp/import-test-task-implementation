import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const sizeResolversConfig = new TenantResolverConfigFactory(
  'size',
).buildResolversConfig();
