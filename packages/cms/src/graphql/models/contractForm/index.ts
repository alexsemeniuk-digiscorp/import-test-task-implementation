import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const contractFormResolversConfig = new TenantResolverConfigFactory(
  'form',
).buildResolversConfig();
