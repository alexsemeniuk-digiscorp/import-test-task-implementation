import { notificationDelete } from '../../../lifecyclesHelpers/conversation/notificationDelete';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeDelete: lifecyclesHookDecorator([notificationDelete]),
};
