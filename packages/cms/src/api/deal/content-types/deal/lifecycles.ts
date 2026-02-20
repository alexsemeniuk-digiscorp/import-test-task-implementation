import { createActivityAfterCreateDeal } from '../../../lifecyclesHelpers/deal/createActivityAfterCreateDeal';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  afterCreate: lifecyclesHookDecorator([createActivityAfterCreateDeal]),
};
