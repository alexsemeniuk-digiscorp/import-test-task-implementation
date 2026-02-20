import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateReturnLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/afterCreateReturnLifecycleHook';
import { beforeCreateReturnLifecycleHook } from '../../../lifecyclesHelpers/inventory/returns/beforeCreateReturnLificycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateReturnLifecycleHook]),
  afterCreate: lifecyclesHookDecorator([afterCreateReturnLifecycleHook]),
};
