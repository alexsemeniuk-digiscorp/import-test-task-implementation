import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateClassPerformerLifecycle } from '../../../lifecyclesHelpers/inventory/beforeCreateClassPerformerLifecycle';
import { appendActualPrice } from '../../../lifecyclesHelpers/price/appendActualPrice';

export default {
  beforeCreate: lifecyclesHookDecorator([beforeCreateClassPerformerLifecycle]),
  afterCreate: lifecyclesHookDecorator([appendActualPrice]),
};
