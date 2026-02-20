import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateReturnItemLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/afterCreateReturnItemLifecycleHook';
import { beforeCreateReturnItemLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/beforeCreateReturnItemLificycleHook';
import { beforeDeleteReturnItemEventLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/beforeDeleteReturnItemEventLifecycleHook';
import { beforeUpdateReturnItemLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/beforeUpdateReturnItemLifecycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateReturnItemLifecycleHook]),
  afterCreate: lifecyclesHookDecorator([afterCreateReturnItemLifecycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateReturnItemLifecycleHook]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteReturnItemEventLifecycleHook,
  ]),
};
