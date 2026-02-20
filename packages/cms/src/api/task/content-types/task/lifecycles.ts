import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

import { afterUpdateTaskLifecycleHook } from '../../../lifecyclesHelpers/task/afterUpdateTaskLifecycleHook';
import { beforeUpdateTaskLifecycleHook } from '../../../lifecyclesHelpers/task/beforeUpdateTaskLifecycleHook';

export default {
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateTaskLifecycleHook]),
  afterUpdate: lifecyclesHookDecorator([afterUpdateTaskLifecycleHook]),
};
