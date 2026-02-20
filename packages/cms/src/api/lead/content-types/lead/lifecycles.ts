import { appendUuid } from '../../../lifecyclesHelpers/appendUuid';
import { cleanPhoneNumber } from '../../../lifecyclesHelpers/crm/cleanPhoneNumber';
import { createContactOnQualifiedLead } from '../../../lifecyclesHelpers/crm/createContactOnQualifiedLead';
import { deleteEntityActivities } from '../../../lifecyclesHelpers/crm/deleteEntityActivities';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';
import { checkIsEmailUnique } from './../../../../api/lifecyclesHelpers/crm/checkIsEmailUnique';
import { lowercaseEmailField } from './../../../lifecyclesHelpers/crm/lowercaseEmailField';

export default {
  beforeCreate: lifecyclesHookDecorator([
    appendUuid,
    checkIsEmailUnique,
    cleanPhoneNumber,
    lowercaseEmailField,
  ]),
  //TODO: return cleanPhoneNumber
  beforeUpdate: lifecyclesHookDecorator([
    checkIsEmailUnique,
    lowercaseEmailField,
  ]),
  afterUpdate: lifecyclesHookDecorator([createContactOnQualifiedLead]),
  beforeDelete: lifecyclesHookDecorator([deleteEntityActivities('lead')]),
};
