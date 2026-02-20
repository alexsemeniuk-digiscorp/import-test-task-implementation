import {
  CONTACTS_IMPORT_IDENTIFIER,
  updatingImportingData,
} from './../../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../../api/redis/redis';
import { handleError } from './../../../../../../helpers/errors';
import { handleAdditionalFieldsUpdating } from './../../../../helpers/handleAdditionalFieldsUpdating';
import { handleCustomFieldsUpdating } from './../../../../helpers/importing/customFields';
import { createNotesForContact } from './../../../importing/utils/utils';

interface Contact {
  id?: string;
  localId?: string;
  leadOwner?: string;
  leadSource?:
    | 'website'
    | 'advertisement'
    | 'external referral'
    | 'online store'
    | 'unknown';
  points?: string;
  avatar?: string;
  email?: string;
  [key: string]: any;
}
export const singleContactUpdating = async (
  parsedContact,
  { tenantFilter, regexedSessionId },
) => {
  const tenantId = tenantFilter?.tenant;
  try {
    if (parsedContact) {
      const contactId = parsedContact?.updatingInfo?.emailsId;
      const updatedContact = await strapi.entityService.update(
        'api::contact.contact',
        contactId,
        {
          data: {
            email: parsedContact?.email,
            fullName: parsedContact?.fullName || undefined,
            phoneNumber: parsedContact?.phoneNumber || undefined,
            address: parsedContact?.address || undefined,
            leadOwner: parsedContact?.leadOwnerId
              ? parsedContact?.leadOwnerId
              : undefined,
            jobTitle: parsedContact?.jobTitle || undefined,
            leadSource: parsedContact?.leadSource?.toLowerCase()
              ? parsedContact?.leadSource?.toLowerCase()
              : undefined,
            birthdayDate: parsedContact?.birthdayDate
              ? new Date(parsedContact?.birthdayDate)
              : undefined,
            points:
              +parsedContact?.points || +parsedContact?.points === 0
                ? 0
                : undefined,
            dateAnniversary: parsedContact?.dateAnniversary
              ? new Date(parsedContact?.dateAnniversary)
              : undefined,
            identityNumber: parsedContact?.identityNumber || undefined,
            marketingOptIn: parsedContact?.marketingOptIn
              ? parsedContact?.marketingOptIn?.replace('/', '_')
              : undefined,
            gender: parsedContact?.gender || undefined,
            avatar: parsedContact?.avatarId || undefined,
            _skipMeilisearchSync: true,
          },
        },
      );

      if (updatedContact?.id) {
        await handleCustomFieldsUpdating(parsedContact?.customFields, {
          updatedContactId: updatedContact?.id,
          tenantId,
        });

        await handleAdditionalFieldsUpdating(parsedContact, updatedContact?.id);

        await createNotesForContact(parsedContact, updatedContact?.id);
      }

      const deleteKey = updatingImportingData(
        regexedSessionId,
        tenantFilter?.tenant,
        CONTACTS_IMPORT_IDENTIFIER,
      );
      if (deleteKey) {
        try {
          await redis.lrem(deleteKey, 1, JSON.stringify(parsedContact));
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    handleError('singleContactUpdating', undefined, e);
  }
};
