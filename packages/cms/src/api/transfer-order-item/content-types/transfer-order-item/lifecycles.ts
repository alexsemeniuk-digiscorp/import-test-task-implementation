import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { updateProductItemQuantityOnTransferOrder } from '../../../lifecyclesHelpers/inventory/updateProductItemQuantityOnTransferOrder';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
  afterCreate: lifecyclesHookDecorator([
    updateProductItemQuantityOnTransferOrder,
  ]),
};
