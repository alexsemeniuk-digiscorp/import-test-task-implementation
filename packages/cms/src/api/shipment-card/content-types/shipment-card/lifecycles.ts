import { setIssDefaultStatusOnDelete } from '../../../lifecyclesHelpers/customer-website/setIsDefaultStatusOnDelete';
import { updateIsDefaultStatus } from '../../../lifecyclesHelpers/customer-website/shipmentCardIsDefaultUpdate';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
export default {
  beforeUpdate: lifecyclesHookDecorator([updateIsDefaultStatus]),
  beforeDelete: lifecyclesHookDecorator([setIssDefaultStatusOnDelete]),
};
