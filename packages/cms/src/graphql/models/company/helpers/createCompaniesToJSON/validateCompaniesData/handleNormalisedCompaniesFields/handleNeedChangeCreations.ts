import {
  COMPANIES_IMPORT_IDENTIFIER,
  updatingImportingData,
} from './../../../../../../../api/redis/helpers/variables/importingVariables';
import { updateRedisImportData } from './../../../../../../helpers/importingHelpers/redisHelpers';

export const handleNeedChangeCreations = async (
  parsedContact,
  tenantFilter,
  needChangeCreations,
  updatingType,
  updatingInfo,
  avatarId,
  isRedis,
  generatedRegex,
) => {
  const updatedObject = {
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
      COMPANIES_IMPORT_IDENTIFIER,
      updatingImportingData,
    );
  }
  needChangeCreations.push(updatedObject);
};
