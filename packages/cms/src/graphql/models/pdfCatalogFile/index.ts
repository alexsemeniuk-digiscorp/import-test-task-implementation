import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const pdfCatalogFileResolversConfig = new TenantResolverConfigFactory(
  'pdfCatalogFile',
).buildResolversConfig();
