import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';
import { withTenantId } from '../../middlewares/withTenant';

export const productInventoryItemRecordResolversConfig =
  new TenantResolverConfigFactory('invtItmRecords').buildResolversConfig({
    'Query.productInventoryItemAgeRange': {
      auth: false,
      middlewares: [withTenantId],
    },
  });
