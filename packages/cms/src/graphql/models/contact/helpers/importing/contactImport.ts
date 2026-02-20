import { generateUUID } from '../../../../../utils/randomBytes';
import {
  completedImportingData,
  CONTACTS_IMPORT_IDENTIFIER,
  spoiledImportingData,
  updatingImportingData,
} from './../../../../../api/redis/helpers/variables/importingVariables';
import { handleCompletedCreationError } from './../../../../helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../helpers/importingHelpers/redisHelpers';
import { handleAdditionalEntities, processCustomFields } from './utils/utils';

export const handleNeedChangeCreations = async (
  parsedContact,
  tenantFilter,
  needChangeCreations,
  updatingType,
  updatingInfo,
  leadOwnerId,
  avatarId,
  isRedis,
  generatedRegex,
) => {
  const updatedObject = {
    leadOwnerId,
    ...parsedContact,
    avatarId,
    tenant: tenantFilter?.tenant,
    updatingType,
    updatingInfo,
  };
  const updatedJson = JSON.stringify(updatedObject);
  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      updatedJson,
      CONTACTS_IMPORT_IDENTIFIER,
      updatingImportingData,
    );
  }
  needChangeCreations.push(updatedObject);
};

export const handleCompletedCreations = async (
  parsedContact,
  tenantFilter,
  completedCreations,
  leadOwnerId,
  avatarId,
  isRedis,
  generatedRegex,
  spoiledCreations,
  customFieldNamesMap?: Map<string, number>,
) => {
  try {
    const createdContact = await strapi.entityService.create(
      'api::contact.contact',
      {
        data: {
          email: parsedContact?.email,
          fullName: parsedContact?.fullName,
          phoneNumber: parsedContact?.phoneNumber,
          address: parsedContact?.address,
          leadOwner: leadOwnerId ? leadOwnerId : undefined,
          jobTitle: parsedContact?.jobTitle,
          leadSource: parsedContact?.leadSource?.toLowerCase()
            ? parsedContact?.leadSource?.toLowerCase()
            : 'unknown',
          birthdayDate: parsedContact?.birthdayDate
            ? new Date(parsedContact?.birthdayDate)
            : undefined,
          points: +parsedContact?.points || 0,
          dateAnniversary: parsedContact?.dateAnniversary
            ? new Date(parsedContact?.dateAnniversary)
            : undefined,
          customCreationDate: parsedContact?.customCreationDate
            ? new Date(parsedContact?.customCreationDate)
            : undefined,
          avatar: avatarId,
          identityNumber: parsedContact?.identityNumber,
          marketingOptIn: parsedContact?.marketingOptIn
            ? parsedContact?.marketingOptIn?.replace('/', '_')
            : 'N_A',
          gender: parsedContact?.gender,
          tenant: tenantFilter?.tenant,
          _skipCheckIsEmailUnique: true,
          _skipCreateEcommerceContact: true,
          _skipSyncContactWithAccountingService: true,
          _skipMeilisearchSync: true,
        },
      },
    );

    if (createdContact?.id) {
      await Promise.all([
        processCustomFields(parsedContact?.customFields, {
          tenantId: tenantFilter.tenant,
          crmType: 'contact',
          contactId: createdContact?.id,
          customFieldNamesMap,
        }),
        handleAdditionalEntities(createdContact?.id, [
          {
            additionalData: parsedContact?.additionalEmails,
            entityType: 'api::crm-additional-email.crm-additional-email',
          },
          {
            additionalData: parsedContact?.additionalPhoneNumbers,
            entityType:
              'api::crm-additional-phone-number.crm-additional-phone-number',
          },
          {
            additionalData: parsedContact?.additionalAddresses,
            entityType: 'api::crm-additional-address.crm-additional-address',
          },
        ]),
        parsedContact?.notes && parsedContact?.notes.length > 0
          ? Promise.all(
              parsedContact.notes.map(async (note) => {
                if (note.note !== '') {
                  await strapi.entityService.create('api::note.note', {
                    data: {
                      contact_id: createdContact.id,
                      description: note.note,
                      customCreationDate:
                        note?.noteCreationDate || new Date()
                          ? new Date(note?.noteCreationDate || new Date())
                          : undefined,
                      _skipCreateActivityAfterCreateNote: true,
                    },
                  });
                }
              }),
            )
          : Promise.resolve(),
      ]);
    }

    const completedCreationJson = JSON.stringify(parsedContact);

    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        CONTACTS_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }

    completedCreations.push(parsedContact);
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedContact,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedContactCreations',
      importIdentifier: CONTACTS_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};

export const handleSpoiledCreations = async ({
  parsedContact,
  isFile,
  spoiledCreations,
  isLeadValid,
  isRedis,
  generatedRegex,
  tenantFilter,
}) => {
  const errors = [];
  if (parsedContact?.avatar && !isFile) {
    errors.push("Avatar id doesn't not exist");
  }
  if (!isLeadValid) {
    errors.push('Lead owner should exist on the platform');
  }

  const spoiledCreation = {
    ...parsedContact,
    errors,
    localId: generateUUID(),
  };

  const spoiledCreationJson = JSON.stringify(spoiledCreation);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationJson,
      CONTACTS_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};
