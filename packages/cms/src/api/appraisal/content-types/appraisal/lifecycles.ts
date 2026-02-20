import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { createActivityAfterCreateAppraisal } from '../../../lifecyclesHelpers/appraisal/createActivityAfterCreateAppraisal';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
  afterCreate: lifecyclesHookDecorator([createActivityAfterCreateAppraisal]),
};
