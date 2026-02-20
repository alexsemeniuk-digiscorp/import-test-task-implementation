import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contractTemplateResolversConfig = new TenantResolverConfigFactory(
  'contractTemplate',
).buildResolversConfig();
