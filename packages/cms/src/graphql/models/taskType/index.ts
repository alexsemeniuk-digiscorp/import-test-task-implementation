import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taskTypeResolversConfig = new TenantResolverConfigFactory(
  'taskType',
).buildResolversConfig();
