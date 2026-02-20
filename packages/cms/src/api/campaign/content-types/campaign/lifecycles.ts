import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { cleanUpRelatedEntities } from '../../../lifecyclesHelpers/marketing/cleanUpRelatedEntities';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
  beforeDelete: lifecyclesHookDecorator([cleanUpRelatedEntities]),
};
