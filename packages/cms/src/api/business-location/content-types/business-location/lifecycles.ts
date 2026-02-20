import { addAccountingServiceConnection } from '../../../lifecyclesHelpers/accountingServices/addAccountingServiceConnection';
import { appendRegexedId } from '../../../lifecyclesHelpers/appendRegexedId';
import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { updateSubscriptionQuantity } from '../../../lifecyclesHelpers/businessLocation/updateSubscriptionQuantity';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { createDefaultSubLocation } from '../../../lifecyclesHelpers/location/createDefaultSubLocation';

export default {
  beforeCreate: lifecyclesHookDecorator([appendUuid, appendRegexedId]),
  afterUpdate: lifecyclesHookDecorator([updateSubscriptionQuantity]),
  afterCreate: lifecyclesHookDecorator([
    createDefaultSubLocation,
    updateSubscriptionQuantity,
    addAccountingServiceConnection,
  ]),
};
