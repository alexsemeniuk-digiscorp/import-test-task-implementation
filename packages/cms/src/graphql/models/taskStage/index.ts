import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const taskStageResolversConfig = new TenantResolverConfigFactory(
  'taskStage',
).buildResolversConfig();
