import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateClassOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterCreateClassOrderItemLifeCycleHook';
import { afterUpdateClassOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterUpdateClassOrderItemLifeCycleHook';
import { beforeCreateClassOrderItemLifecycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeCreateClassOrderItemLificycleHook';
import { beforeDeleteClassOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeDeleteClassOrderItemLifeCycleHook';
import { beforeUpdateClassOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeUpdateClassOrderItemLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateClassOrderItemLifecycleHook,
  ]),
  afterCreate: lifecyclesHookDecorator([
    afterCreateClassOrderItemLifeCycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateClassOrderItemLifeCycleHook,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    afterUpdateClassOrderItemLifeCycleHook,
  ]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteClassOrderItemLifeCycleHook,
  ]),
};
