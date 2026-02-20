import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taskLocationResolversConfig = new TenantResolverConfigFactory(
  'taskLocation',
).buildResolversConfig();
