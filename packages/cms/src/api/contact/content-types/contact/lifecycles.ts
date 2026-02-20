import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { checkIsEmailUnique } from '../../../lifecyclesHelpers/crm/checkIsEmailUnique';
import { deleteEntityActivities } from '../../../lifecyclesHelpers/crm/deleteEntityActivities';

import { cleanPhoneNumber } from '../../../lifecyclesHelpers/crm/cleanPhoneNumber';
import { createEcommerceContact } from '../../../lifecyclesHelpers/crm/createEcommerceContact';
import { updateEcommerceContact } from '../../../lifecyclesHelpers/crm/updateEcommerceContact';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

import { syncContactWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncContactWithAccountingService';
import { appendCustomCreationDate } from './../../../lifecyclesHelpers/appendCustomCreationDate';
import { lowercaseEmailField } from './../../../lifecyclesHelpers/crm/lowercaseEmailField';
export default {
  beforeCreate: lifecyclesHookDecorator([
    appendUuid,
    appendCustomCreationDate,
    checkIsEmailUnique,
    cleanPhoneNumber,
    lowercaseEmailField,
  ]),
  beforeUpdate: lifecyclesHookDecorator([
    checkIsEmailUnique,
    cleanPhoneNumber,
    lowercaseEmailField,
  ]),
  afterCreate: lifecyclesHookDecorator([
    createEcommerceContact('contact'),
    syncContactWithAccountingService('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    updateEcommerceContact,
    syncContactWithAccountingService('update'),
  ]),
  beforeDelete: lifecyclesHookDecorator([deleteEntityActivities('contact')]),
};
