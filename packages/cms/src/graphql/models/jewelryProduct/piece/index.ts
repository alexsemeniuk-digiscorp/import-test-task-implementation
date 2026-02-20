import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const pieceResolversConfig = new TenantResolverConfigFactory(
  'piece',
).buildResolversConfig();
