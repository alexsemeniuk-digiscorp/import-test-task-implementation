import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterCreateOrderItemLifeCycleHook';
import { afterUpdateOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterUpdateOrderItemLifeCycleHook';
import { beforeCreateOrderItemLifecycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeCreateOrderItemLificycleHook';
import { beforeDeleteOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeDeleteOrderItemLifeCycleHook';
import { beforeUpdateOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeUpdateOrderItemLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateOrderItemLifecycleHook]),
  afterCreate: lifecyclesHookDecorator([afterCreateOrderItemLifeCycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateOrderItemLifeCycleHook]),
  afterUpdate: lifecyclesHookDecorator([afterUpdateOrderItemLifeCycleHook]),
  beforeDelete: lifecyclesHookDecorator([beforeDeleteOrderItemLifeCycleHook]),
};
