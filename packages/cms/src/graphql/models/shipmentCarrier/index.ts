import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const shipmentCarrierResolversConfig = new TenantResolverConfigFactory(
  'shipmentCarrier',
).buildResolversConfig();
