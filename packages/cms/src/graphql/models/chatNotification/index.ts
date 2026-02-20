import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const chatNotificationResolversConfig = new TenantResolverConfigFactory(
  'chat-notification',
).buildResolversConfig();
