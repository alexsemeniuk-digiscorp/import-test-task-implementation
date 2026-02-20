import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';
import { withTenantId } from '../../middlewares/withTenant';

export const invoiceResolversConfig = new TenantResolverConfigFactory(
  'invoice',
).buildResolversConfig({
  'Mutation.sendInvoice': {
    auth: true,
    middlewares: [withTenantId],
  },
});
