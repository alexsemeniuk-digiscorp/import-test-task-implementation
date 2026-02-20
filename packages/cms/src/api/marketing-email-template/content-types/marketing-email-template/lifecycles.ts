import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
};
