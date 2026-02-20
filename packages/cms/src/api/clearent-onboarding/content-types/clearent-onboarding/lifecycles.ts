import { modifyClearentApiKeyLifecycleHook } from '../../../lifecyclesHelpers/clearentOnboarding/modifyClearentApiKeyLifecycleHook';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([modifyClearentApiKeyLifecycleHook]),
  beforeUpdate: lifecyclesHookDecorator([modifyClearentApiKeyLifecycleHook]),
};
