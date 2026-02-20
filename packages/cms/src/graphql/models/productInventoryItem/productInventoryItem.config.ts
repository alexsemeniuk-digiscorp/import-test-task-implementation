import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';
import { withTenantId } from '../../middlewares/withTenant';

export const productInventoryItemResolversConfig =
  new TenantResolverConfigFactory('productInventoryItem').buildResolversConfig({
    'Query.productsInventoryItemPriceRange': {
      auth: false,
      middlewares: [withTenantId],
    },
    'Query.productsInventoryItemQuantityRange': {
      auth: false,
      middlewares: [withTenantId],
    },
    'Query.productsInventoryItemHistoryNumbers': {
      auth: false,
      middlewares: [withTenantId],
    },
  });
