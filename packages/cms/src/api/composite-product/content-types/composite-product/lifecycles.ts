import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateCompositeProductLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeCreateCompositeProductLifeCycleHook';
import { beforeUpdateCompositeProductLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateCompositeProductLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateCompositeProductLifeCycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateCompositeProductLifeCycleHook,
  ]),
};
