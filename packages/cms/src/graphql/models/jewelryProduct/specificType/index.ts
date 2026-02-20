import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const specificTypesResolversConfig = new TenantResolverConfigFactory(
  'specificType',
).buildResolversConfig();
