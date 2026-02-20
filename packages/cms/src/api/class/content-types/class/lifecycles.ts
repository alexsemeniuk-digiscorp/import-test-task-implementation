import { beforeCreateClassLifeCycleHook } from '../../..//lifecyclesHelpers/inventory/beforeCreateClassLifeCycleHook';
import { syncClassWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncClassWithAccountingService';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeUpdateClassLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateClassLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateClassLifeCycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateClassLifeCycleHook]),
  afterCreate: lifecyclesHookDecorator([
    syncClassWithAccountingService('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    syncClassWithAccountingService('update'),
  ]),
};
