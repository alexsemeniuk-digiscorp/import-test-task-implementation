import {
  COMPANIES_IMPORT_IDENTIFIER,
  completedImportingData,
} from './../../../../../../../api/redis/helpers/variables/importingVariables';
import { handleCompletedCreationError } from './../../../../../../helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../../../helpers/importingHelpers/redisHelpers';

export const handleCompletedCreations = async (
  parsedCompany,
  tenantFilter,
  completedCreations,
  avatarId,
  isRedis,
  generatedRegex,
  spoiledCreations,
) => {
  try {
    const createdContact = await strapi.entityService.create(
      'api::company.company',
      {
        data: {
          email: parsedCompany?.email,
          name: parsedCompany?.name,
          phoneNumber: parsedCompany?.phoneNumber,
          address: parsedCompany?.address,
          secondAddress: parsedCompany?.secondAddress,
          points: +parsedCompany?.points || 0,
          customCreationDate: parsedCompany?.customCreationDate
            ? new Date(parsedCompany?.customCreationDate)
            : undefined,
          type: parsedCompany?.type || undefined,
          avatar: avatarId,
          tenant: tenantFilter?.tenant,
          priceGroup: parsedCompany?.priceGroup || undefined,
          _skipCheckIsEmailUnique: true,
          _skipAppendLeadOwnerToCompanyContact: true,
          _skipSyncCompanyWithAccountingService: true,
          _skipMeilisearchSync: true,
        },
      },
    );

    if (createdContact?.id) {
      if (parsedCompany?.notes && parsedCompany?.notes.length > 0) {
        await Promise.all(
          parsedCompany.notes.map(async (note) => {
            if (note.note !== '') {
              await strapi.entityService.create('api::note.note', {
                data: {
                  company_id: createdContact.id,
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
        );
      }
    }

    const completedCreationJson = JSON.stringify(parsedCompany);

    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        COMPANIES_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }

    completedCreations.push(parsedCompany);
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedCompany,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedContactCreations',
      importIdentifier: COMPANIES_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};
