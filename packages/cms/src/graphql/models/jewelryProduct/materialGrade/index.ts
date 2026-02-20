import { TenantResolverConfigFactory } from '../../../helpers/TenantResolverConfigFactory';

export const materialGradeResolversConfig = new TenantResolverConfigFactory(
  'materialGrade',
).buildResolversConfig();
