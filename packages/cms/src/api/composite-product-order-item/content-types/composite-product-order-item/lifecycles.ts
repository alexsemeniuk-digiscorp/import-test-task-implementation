import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateCompositeProductOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterCreateCompositeProductOrderItemLifeCycleHook';
import { afterUpdateCompositeProductOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterUpdateCompositeProductOrderItemLifeCycleHook';
import { beforeCreateCompositeProductOrderItemLifecycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeCreateCompositeProductOrderItemLificycleHook';
import { beforeDeleteCompositeProductOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeDeleteCompositeProductOrderItemLifeCycleHook';
import { beforeUpdateCompositeProductOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeUpdateCompositeProductOrderItemLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateCompositeProductOrderItemLifecycleHook,
  ]),
  afterCreate: lifecyclesHookDecorator([
    afterCreateCompositeProductOrderItemLifeCycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateCompositeProductOrderItemLifeCycleHook,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    afterUpdateCompositeProductOrderItemLifeCycleHook,
  ]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteCompositeProductOrderItemLifeCycleHook,
  ]),
};
