import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const conversationResolversConfig = new TenantResolverConfigFactory(
  'conversation',
).buildResolversConfig();
