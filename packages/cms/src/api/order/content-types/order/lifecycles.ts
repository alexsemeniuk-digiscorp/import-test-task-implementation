import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

import { afterCreateOrderLifecycleHook } from '../../../lifecyclesHelpers/order/afterCreateOrderLifecycleHook';
import { afterDeleteOrderLifecycleHook } from '../../../lifecyclesHelpers/order/afterDeleteOrderLifecycleHook';
import { afterUpdateOrderLifecycleHook } from '../../../lifecyclesHelpers/order/afterUpdateOrderLifecycleHook';
import { beforeCreateOrderLifecycleHook } from '../../../lifecyclesHelpers/order/beforeCreateOrderLificycleHook';
import { beforeDeleteOrderLifecycleHook } from '../../../lifecyclesHelpers/order/beforeDeleteOrderLifecycleHook';
import { beforeUpdateOrderLifecycleHook } from '../../../lifecyclesHelpers/order/beforeUpdateOrderLifecycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateOrderLifecycleHook]),
  afterCreate: lifecyclesHookDecorator([afterCreateOrderLifecycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateOrderLifecycleHook]),
  afterUpdate: lifecyclesHookDecorator([afterUpdateOrderLifecycleHook]),
  beforeDelete: lifecyclesHookDecorator([beforeDeleteOrderLifecycleHook]),
  afterDelete: lifecyclesHookDecorator([afterDeleteOrderLifecycleHook]),
};
