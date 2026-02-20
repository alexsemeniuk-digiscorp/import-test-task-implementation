import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

const factory = new TenantResolverConfigFactory('quickPaySetting');

export const quickPayCustomOptionResolversConfig = {
  ...factory.buildResolversConfig(),
  'Query.quickPaysSetting': factory.buildCollectionQueryConfig(),
};
