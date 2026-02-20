import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { appendToken } from '../../../lifecyclesHelpers/marketing/appendToken';

export default {
  afterCreate: lifecyclesHookDecorator([appendToken]),
};
