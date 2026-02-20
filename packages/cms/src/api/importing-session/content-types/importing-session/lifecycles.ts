import { appendRegexedId } from '../../../lifecyclesHelpers/appendRegexedId';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([appendRegexedId]),
};
