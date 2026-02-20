import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const shapeResolversConfig = new TenantResolverConfigFactory(
  'shape',
).buildResolversConfig();
