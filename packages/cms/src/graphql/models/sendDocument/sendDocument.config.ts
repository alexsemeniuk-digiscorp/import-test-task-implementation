import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const sendDocumentResolversConfig = new TenantResolverConfigFactory(
  'sendDocument',
).buildResolversConfig();
