import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { updateProductItemOnAdjustment } from '../../../lifecyclesHelpers/inventory/updateProductItemOnAdjustment';

export default {
  afterCreate: lifecyclesHookDecorator([updateProductItemOnAdjustment]),
};
