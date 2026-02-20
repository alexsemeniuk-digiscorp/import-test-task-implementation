import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const marketingEmailTemplateResolversConfig =
  new TenantResolverConfigFactory(
    'marketingEmailTemplate',
  ).buildResolversConfig();
