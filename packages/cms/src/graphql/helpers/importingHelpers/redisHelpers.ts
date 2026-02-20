import {
  importingMetadata,
  importingProcessedFieldsCount,
  importingTotalFieldsCount,
  spoiledImportingData,
} from './../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../api/redis/redis';

export const setImportingTotalFieldsCount = async (
  regexedId,
  tenantId,
  parsedRowsLength,
  importIdentifier,
) => {
  const key = importingTotalFieldsCount(regexedId, tenantId, importIdentifier);
  await redis.set(key, parsedRowsLength - 1 ?? 0);
};

export const updateRedisImportData = async (
  generatedRegex,
  tenantFilter,
  updatedJson,
  importIdentifier,
  importingDataGenerator,
) => {
  const tenant = tenantFilter?.tenant;
  await redis.lpush(
    importingDataGenerator(generatedRegex, tenant, importIdentifier),
    updatedJson,
  );

  await redis.incr(
    importingProcessedFieldsCount(generatedRegex, tenant, importIdentifier),
  );
};

export const updateImportingMetadata = async (
  regexedId,
  tenantId,
  spoiledFields,
  metadata,
  importIdentifier,
) => {
  await redis.hset(
    importingMetadata(regexedId, tenantId, importIdentifier),
    metadata,
  );

  for (let i = 0; i < spoiledFields?.length; i++) {
    const spoiledFieldJSON = JSON.stringify(spoiledFields?.[i] ?? []);
    await updateRedisImportData(
      regexedId,
      { tenant: tenantId },
      spoiledFieldJSON,
      importIdentifier,
      spoiledImportingData,
    );
  }
};
