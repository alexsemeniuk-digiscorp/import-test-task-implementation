import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateServiceOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterCreateServiceOrderItemLifeCycleHook';
import { afterUpdateServiceOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterUpdateServiceOrderItemLifeCycleHook';
import { beforeCreateServiceOrderItemLifecycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeCreateServiceOrderItemLificycleHook';
import { beforeDeleteServiceOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeDeleteServiceOrderItemLifeCycleHook';
import { beforeUpdateServiceOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeUpdateServiceOrderItemLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateServiceOrderItemLifecycleHook,
  ]),
  afterCreate: lifecyclesHookDecorator([
    afterCreateServiceOrderItemLifeCycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateServiceOrderItemLifeCycleHook,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    afterUpdateServiceOrderItemLifeCycleHook,
  ]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteServiceOrderItemLifeCycleHook,
  ]),
};
