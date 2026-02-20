import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const appraisalContractResolversConfig = new TenantResolverConfigFactory(
  'appraisal',
).buildResolversConfig();
