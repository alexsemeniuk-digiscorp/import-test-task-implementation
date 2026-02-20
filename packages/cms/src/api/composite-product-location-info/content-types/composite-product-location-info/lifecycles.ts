import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { beforeCreateCompositeProductLocationInfoLifecycle } from '../../../lifecyclesHelpers/inventory/beforeCreateCompositeProductLocationInfoLifecycle';

export default {
  beforeCreate: lifecyclesHookDecorator([
    beforeCreateCompositeProductLocationInfoLifecycle,
  ]),
};
