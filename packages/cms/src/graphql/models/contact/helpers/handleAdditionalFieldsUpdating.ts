import { handleError } from './../../../helpers/errors';
import { handleAdditionalData } from './handleAdditionalFieldsUpdating/handleAdditionalData';

export const handleAdditionalFieldsUpdating = async (
  parsedContact,
  updatedContactId,
) => {
  try {
    const additionalDataHandlers = [
      {
        field: 'additionalEmails',
        entity: 'api::crm-additional-email.crm-additional-email',
      },
      {
        field: 'additionalPhoneNumbers',
        entity: 'api::crm-additional-phone-number.crm-additional-phone-number',
      },
      {
        field: 'additionalAddresses',
        entity: 'api::crm-additional-address.crm-additional-address',
      },
    ];

    for (const { field, entity } of additionalDataHandlers) {
      await handleAdditionalData(
        field,
        entity,
        parsedContact,
        updatedContactId,
      );
    }
  } catch (e) {
    handleError('handleAdditionalFieldsUpdating', undefined, e);
  }
};
