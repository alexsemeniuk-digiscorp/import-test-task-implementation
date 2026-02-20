import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const shipmentResolversConfig = new TenantResolverConfigFactory(
  'shipment',
).buildResolversConfig();
