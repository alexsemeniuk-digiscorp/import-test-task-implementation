import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { afterCreateMembershipOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterCreateMembershipOrderItemLifeCycleHook';
import { afterUpdateMembershipOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/afterUpdateMembershipOrderItemLifeCycleHook';
import { beforeCreateMembershipOrderItemLifecycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeCreateMembershipOrderItemLificycleHook';
import { beforeDeleteMembershipOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeDeleteMembershipOrderItemLifeCycleHook';
import { beforeUpdateMembershipOrderItemLifeCycleHook } from '../../../lifecyclesHelpers/selling/pos/beforeUpdateMembershipOrderItemLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateMembershipOrderItemLifecycleHook,
  ]),
  afterCreate: lifecyclesHookDecorator([
    afterCreateMembershipOrderItemLifeCycleHook,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    beforeUpdateMembershipOrderItemLifeCycleHook,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    afterUpdateMembershipOrderItemLifeCycleHook,
  ]),
  beforeDelete: lifecyclesHookDecorator([
    beforeDeleteMembershipOrderItemLifeCycleHook,
  ]),
};
