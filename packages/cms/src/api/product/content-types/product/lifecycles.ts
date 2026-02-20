import { syncProductWithAccountingServices } from '../../../lifecyclesHelpers/accountingServices/syncProductWithAccountingService';
import { createEcommerceProduct } from '../../../lifecyclesHelpers/crm/createEcommerceProduct';
import { updateEcommerceProduct } from '../../../lifecyclesHelpers/crm/updateEcommerceProduct';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateProductLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeCreateProductLifeCycleHook';
import { beforeUpdateProductLifeCycleHook } from '../../../lifecyclesHelpers/inventory/beforeUpdateProductLifeCycleHook';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateProductLifeCycleHook]),
  beforeUpdate: lifecyclesHookDecorator([beforeUpdateProductLifeCycleHook]),
  afterCreate: lifecyclesHookDecorator([
    createEcommerceProduct,
    syncProductWithAccountingServices('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    updateEcommerceProduct,
    syncProductWithAccountingServices('update'),
  ]),
};
