import { spoiledImportingData } from './../../../api/redis/helpers/variables/importingVariables';
import { handleError, handleLogger } from './../errors';
import { updateRedisImportData } from './../importingHelpers/redisHelpers';

export const handleCsvProcessingError = async (
  e,
  tenantId,
  importingIndentifier,
) => {
  console.error('Error occurred during CSV processing:', e.message);

  const [lastSession] =
    (await strapi.entityService.findMany(
      'api::importing-session.importing-session',
      {
        filters: { tenant: tenantId, type: importingIndentifier },
        sort: ['createdAt:desc'],
        limit: 1,
      },
    )) || [];

  if (lastSession?.id) {
    await strapi.entityService.update(
      'api::importing-session.importing-session',
      lastSession.id,
      { data: { state: 'completed' } },
    );
  }

  if (
    e.message ===
    "Custom: Headers don't match the example file or have duplicate values"
  ) {
    handleError(
      'validateContactsHeaders',
      'Headers in file did not match template',
      undefined,
      true,
    );
  }
};

export const handleCompletedCreationError = async ({
  parsedEntity,
  err,
  spoiledCreations,
  isRedis,
  generatedRegex,
  tenantFilter,
  functionName,
  importIdentifier,
}: {
  parsedEntity: Record<string, any>;
  err: Error;
  isRedis: boolean;
  generatedRegex: string;
  tenantFilter: { tenant: string };
  spoiledCreations: Record<string, any>[];
  functionName: string;
  importIdentifier: string;
}) => {
  handleLogger(
    'error',
    functionName,
    `Error in Row ${JSON.stringify(parsedEntity)}`,
  );
  handleLogger('error', functionName, err.message);

  const parsedWithError = {
    ...parsedEntity,
    errors: [err.message?.toString()],
  };

  const spoiledCreationsJson = JSON.stringify(parsedWithError);

  if (isRedis) {
    await updateRedisImportData(
      generatedRegex,
      tenantFilter,
      spoiledCreationsJson,
      importIdentifier,
      spoiledImportingData,
    );
  }

  spoiledCreations.push(parsedWithError);
};
