import { cleanPhoneNumber } from '../../../lifecyclesHelpers/crm/cleanPhoneNumber';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
export default {
  beforeCreate: lifecyclesHookDecorator([cleanPhoneNumber]),
  beforeUpdate: lifecyclesHookDecorator([cleanPhoneNumber]),
};
