import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { cleanUpSequenceInfo } from '../../../lifecyclesHelpers/marketing/cleanUpSequenceInfo';
import { updateSequenceNumberOnAddNewStep } from '../../../lifecyclesHelpers/marketing/updateSequenceNumberOnAddNewStep';

export default {
  afterCreate: lifecyclesHookDecorator([updateSequenceNumberOnAddNewStep]),
  beforeDelete: lifecyclesHookDecorator([cleanUpSequenceInfo]),
};
