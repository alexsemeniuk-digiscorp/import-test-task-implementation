import { TenantResolverConfigFactory } from '../../helpers/TenantResolverConfigFactory';

const factory = new TenantResolverConfigFactory('orderSetting');

export const orderSettingResolverConfig = {
  ...factory.buildResolversConfig(),
  'Query.ordersSetting': factory.buildCollectionQueryConfig(),
};
