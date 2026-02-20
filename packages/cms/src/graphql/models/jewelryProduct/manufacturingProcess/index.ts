import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const manufacturingProcessTypeResolversConfig =
  new TenantResolverConfigFactory(
    'manufacturingProcess',
  ).buildResolversConfig();
