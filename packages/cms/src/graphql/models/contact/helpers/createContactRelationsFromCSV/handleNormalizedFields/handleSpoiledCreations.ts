import { generateUUID } from '../../../../../../utils/randomBytes';
import {
  CONTACT_RELATIONS_IMPORT_IDENTIFIER,
  spoiledImportingData,
} from './../../../../../../api/redis/helpers/variables/importingVariables';
import { updateRedisImportData } from './../../../../../helpers/importingHelpers/redisHelpers';

export const handleSpoiledCreations = async ({
  parsedContactRelation,
  existedFromContactEmails,
  existedToContactEmails,
  spoiledCreations,
  isRedis,
  generatedRegex,
  tenantFilter,
}) => {
  const errors = [];
  if (!existedFromContactEmails?.length) {
    errors.push('No CONTACT with such email found');
  }

  if (!existedToContactEmails?.length) {
    errors.push('No TO CONTACT with such email found');
  }

  const spoiledCreation = {
    ...parsedContactRelation,
    errors,
    localId: generateUUID(),
  };

  const spoiledCreationJson = JSON.stringify(spoiledCreation);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationJson,
      CONTACT_RELATIONS_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};
