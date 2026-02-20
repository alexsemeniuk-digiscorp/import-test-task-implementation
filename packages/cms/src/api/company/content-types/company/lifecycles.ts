import { syncCompanyWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncCompanyWithAccountingService';
import { appendCustomCreationDate } from '../../../lifecyclesHelpers/appendCustomCreationDate';
import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { appendLeadOwnerToCompanyContact } from '../../../lifecyclesHelpers/crm/appendLeadOwnerToCompanyContact';
import { checkIsEmailUnique } from '../../../lifecyclesHelpers/crm/checkIsEmailUnique';
import { cleanPhoneNumber } from '../../../lifecyclesHelpers/crm/cleanPhoneNumber';
import { deleteEntityActivities } from '../../../lifecyclesHelpers/crm/deleteEntityActivities';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
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
    appendLeadOwnerToCompanyContact,
    syncCompanyWithAccountingService('create'),
  ]),
  afterUpdate: lifecyclesHookDecorator([
    appendLeadOwnerToCompanyContact,
    syncCompanyWithAccountingService('update'),
  ]),
  beforeDelete: lifecyclesHookDecorator([deleteEntityActivities('company')]),
};
