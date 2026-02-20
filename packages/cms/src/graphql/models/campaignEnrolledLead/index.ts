import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const campaignEnrolledLeadResolversConfig =
  new TenantResolverConfigFactory(
    'campaignEnrolledLead',
  ).buildResolversConfig();
