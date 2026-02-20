import {
  completedImportingData,
  CONTACT_RELATIONS_IMPORT_IDENTIFIER,
} from './../../../../../../api/redis/helpers/variables/importingVariables';
import { handleCompletedCreationError } from './../../../../../helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../../helpers/importingHelpers/redisHelpers';

export const handleCompletedCreations = async (
  parsedContactRelation,
  {
    completedCreations,
    existedFromContactEmailsId,
    existedToContactEmailsId,
    relationTypeId,
    isRedis,
    generatedRegex,
    tenantFilter,
    spoiledCreations,
  },
) => {
  try {
    await strapi.entityService.create('api::crm-relation.crm-relation', {
      data: {
        fromContact: existedFromContactEmailsId,
        toContact: existedToContactEmailsId,
        relationType: relationTypeId,
      },
    });

    const completedCreationJson = JSON.stringify(parsedContactRelation);

    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        CONTACT_RELATIONS_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }

    completedCreations.push(parsedContactRelation);
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedContactRelation,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedContactRelationCreations',
      importIdentifier: CONTACT_RELATIONS_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};
