import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const schedulingRecurrenceResolversConfig =
  new TenantResolverConfigFactory(
    'schedulingRecurrence',
  ).buildResolversConfig();
