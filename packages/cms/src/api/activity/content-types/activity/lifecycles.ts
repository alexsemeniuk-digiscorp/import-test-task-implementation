import { appendCustomCreationDate } from '../../../lifecyclesHelpers/appendCustomCreationDate';
import { createFollowingTask } from '../../../lifecyclesHelpers/crm/createFollowingTask';
import { deleteFollowingTask } from '../../../lifecyclesHelpers/crm/deleteFollowingTask';
import { updateCrmEntityOnPointsActivityAction } from '../../../lifecyclesHelpers/crm/updateCrmEntityOnPointsActivityAction';
import { updateFollowingTask } from '../../../lifecyclesHelpers/crm/updateFollowingTask';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([appendCustomCreationDate]),
  afterCreate: lifecyclesHookDecorator([
    createFollowingTask,
    updateCrmEntityOnPointsActivityAction,
  ]),
  afterUpdate: lifecyclesHookDecorator([
    updateFollowingTask,
    updateCrmEntityOnPointsActivityAction,
  ]),
  beforeDelete: lifecyclesHookDecorator([deleteFollowingTask]),
};
