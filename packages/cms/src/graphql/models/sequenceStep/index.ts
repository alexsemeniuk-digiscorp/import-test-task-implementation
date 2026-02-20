import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const sequenceStepResolversConfig = new TenantResolverConfigFactory(
  'sequenceStep',
).buildResolversConfig();
