import { syncServiceWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncServiceWithAccountingService';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateServiceLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeCreateServiceLifeCycleHook';
import { beforeUpdateServiceLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateServiceLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateServiceLifeCycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateServiceLifeCycleHook]),
  afterCreate: lifecyclesHookDecorator([
    syncServiceWithAccountingService('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    syncServiceWithAccountingService('update'),
  ]),
};
