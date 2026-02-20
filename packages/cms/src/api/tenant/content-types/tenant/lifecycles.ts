import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

import { afterCreateLifecycleHook } from '../../../lifecyclesHelpers/tenant/afterCreateLifecycleHook';

export default {
  afterCreate: lifecyclesHookDecorator([afterCreateLifecycleHook]),
};
