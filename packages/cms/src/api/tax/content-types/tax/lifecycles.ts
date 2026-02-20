import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { checkIsTaxNameUnique } from '../../../lifecyclesHelpers/tenantNameUniqueness/checkIsTaxNameUnique';

export default {
  beforeCreate: lifecyclesHookDecorator([checkIsTaxNameUnique]),
  beforeUpdate: lifecyclesHookDecorator([checkIsTaxNameUnique]),
};
