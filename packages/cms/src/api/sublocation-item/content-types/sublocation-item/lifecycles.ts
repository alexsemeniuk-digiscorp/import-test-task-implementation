import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

import { beforeUpdateSublocationItemLifecycleHook } from '../../../lifecyclesHelpers/sublocation-item/beforeUpdateSublocationItemLifecycleHook';

export default {
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateSublocationItemLifecycleHook,
  ]),
};
