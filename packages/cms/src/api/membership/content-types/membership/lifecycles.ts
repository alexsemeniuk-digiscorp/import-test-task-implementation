import { syncMembershipWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncMembershipWithAccountingService';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateMembershipLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeCreateMembershipLifeCycleHook';
import { beforeUpdateMembershipLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateMembershipLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateMembershipLifeCycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateMembershipLifeCycleHook]),
  afterCreate: lifecyclesHookDecorator([
    syncMembershipWithAccountingService('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    syncMembershipWithAccountingService('update'),
  ]),
};
