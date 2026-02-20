import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const schedulingAppointmentResolversConfig =
  new TenantResolverConfigFactory(
    'schedulingAppointment',
  ).buildResolversConfig();
