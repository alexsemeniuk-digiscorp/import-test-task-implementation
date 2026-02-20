import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateProductInventoryItemEventLifecycleHook } from '../../../lifecyclesHelpers/inventory/afterCreateProductInventoryItemEventLifecycleHook';
import { afterUpdateProductInventoryItemEventLifeCycleHook } from '../../../lifecyclesHelpers/inventory/afterUpdateProductInventoryItemEventLifeCycleHook';
import { beforeCreateProductInventoryItemEventLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeCreateProductInventoryItemEventLifeCycleHook';
import { beforeDeleteProductInventoryItemEventLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeDeleteProductInventoryItemEventLifeCycleHook';
import { beforeUpdateProductInventoryItemEventLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateProductInventoryItemEventLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateProductInventoryItemEventLifeCycleHook,
  ]),
  afterCreate: lifecyclesHookDecorator([
    afterCreateProductInventoryItemEventLifecycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateProductInventoryItemEventLifeCycleHook,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    afterUpdateProductInventoryItemEventLifeCycleHook,
  ]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteProductInventoryItemEventLifeCycleHook,
  ]),
};
