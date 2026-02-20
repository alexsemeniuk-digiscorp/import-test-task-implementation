import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const accountServiceConnectionResolversConfig =
  new TenantResolverConfigFactory(
    'accountServiceConnection',
  ).buildResolversConfig();
