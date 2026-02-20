import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taskResolversConfig = new TenantResolverConfigFactory(
  'task',
).buildResolversConfig();
