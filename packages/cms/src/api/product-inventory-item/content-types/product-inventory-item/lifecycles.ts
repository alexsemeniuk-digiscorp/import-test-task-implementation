import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateProductInventoryItemLifecycle } from '../../../lifecyclesHelpers/inventory/beforeCreateProductInventoryItemLifecycle';
import { beforeUpdateProductInventoryItemLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateProductInventoryItemLifeCycleHook';
export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateProductInventoryItemLifecycle,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateProductInventoryItemLifeCycleHook,
  ]),
};
