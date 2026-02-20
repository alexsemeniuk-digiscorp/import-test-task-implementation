import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateServicePerformerLifecycle } from '../../../lifecyclesHelpers/inventory/beforeCreateServicePerformerLifecycle';
import { appendActualPrice } from '../../../lifecyclesHelpers/price/appendActualPrice';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateServicePerformerLifecycle,
  ]),
  afterCreate: lifecyclesHookDecorator([appendActualPrice]),
};
