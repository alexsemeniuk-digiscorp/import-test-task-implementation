import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const crmRelationTypeConfig = new TenantResolverConfigFactory(
  'crmRelationType',
).buildResolversConfig();
