import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';
import { withTenantId } from '../../middlewares/withTenant';

export const servicePerformerResolversConfig = new TenantResolverConfigFactory(
  'servicePerformer',
).buildResolversConfig({
  'Query.servicesPriceRange': {
    auth: false,
    middlewares: [withTenantId],
  },
});
