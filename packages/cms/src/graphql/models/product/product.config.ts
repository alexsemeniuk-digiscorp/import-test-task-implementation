import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';
import { withTenantId } from '../../middlewares/withTenant';

export const productResolversConfig = new TenantResolverConfigFactory(
  'product',
).buildResolversConfig({
  'Query.productsPriceRange': {
    auth: false,
    middlewares: [withTenantId],
  },
});
