import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { bootstrapConversation } from '../../../lifecyclesHelpers/conversation/bootstrapConversation';
import { deleteConversation } from '../../../lifecyclesHelpers/conversation/deleteConversation';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid]),
  afterCreate: lifecyclesHookDecorator([bootstrapConversation]),
  beforeDelete: lifecyclesHookDecorator([deleteConversation]),
};
