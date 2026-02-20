import {
  COMPANIES_IMPORT_IDENTIFIER,
  spoiledImportingData,
} from './../../../../../../../api/redis/helpers/variables/importingVariables';
import { generateUUID } from './../../../../../../../utils/randomBytes';
import { updateRedisImportData } from './../../../../../../helpers/importingHelpers/redisHelpers';

export const handleSpoiledCreations = async ({
  parsedContact,
  isFile,
  spoiledCreations,
  isRedis,
  generatedRegex,
  tenantFilter,
}) => {
  const errors = [];
  if (parsedContact?.avatar && !isFile) {
    errors.push("Avatar id doesn't not exist");
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
      COMPANIES_IMPORT_IDENTIFIER,
      spoiledImportingData,
    );
  }
  spoiledCreations.push(spoiledCreation);
};
