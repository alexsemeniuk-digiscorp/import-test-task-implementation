import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const campaignEnrolledContactResolversConfig =
  new TenantResolverConfigFactory(
    'campaignEnrolledContact',
  ).buildResolversConfig();
