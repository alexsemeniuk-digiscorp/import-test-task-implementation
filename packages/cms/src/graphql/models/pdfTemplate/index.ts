import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

export const pdfTemplateResolversConfig = new TenantResolverConfigFactory(
  'pdfTemplate',
).buildResolversConfig();
