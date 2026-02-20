import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { deleteResourceCountOnInventoryItemDeletion } from '../../../lifecyclesHelpers/inventory/deleteResourceCountOnInventoryItemDeletion';

export default {
  beforeDelete: lifecyclesHookDecorator([
    deleteResourceCountOnInventoryItemDeletion,
  ]),
};
