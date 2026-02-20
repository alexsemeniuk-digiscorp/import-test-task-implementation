import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from '../../../../types/generated/graphql';
import contactRelationsImportFieldsQueue from './../../../../api/redis/bullmq/contactRelations';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import {
  CONTACT_RELATIONS_IMPORT_IDENTIFIER,
  spoiledImportingData,
} from './../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { checkRedisConnection } from './../../../../api/redis/redis/utils/checkRedisConnection';
import {
  setImportingTotalFieldsCount,
  updateRedisImportData,
} from './../../../../graphql/helpers/importingHelpers/redisHelpers';
import { generateId } from './../../../../utils/randomBytes';
import { handleLogger } from './../../../helpers/errors';
import { handleCsvProcessingError } from './../../../helpers/importingHelpers/errorHandler';
import {
  createImportingSession,
  handleCsvUpload,
} from './../../../helpers/importingHelpers/fileHelper';
import { parseAndProcessCSV } from './../../../helpers/importingHelpers/utils';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';
import { csvContactRelationsToJSON } from './../helpers/createContactRelationsFromCSV/csvContactRelationsToJSON';
import { handleContactRelationsFields } from './../helpers/createContactRelationsFromCSV/handleContactRelationsFields';

const { ApplicationError } = errors;

const worker = new Worker(
  CONTACT_RELATIONS_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      spoiledCreations,
      completedCreations,

      meta: { tenantFilter, userId, generatedRegex },
      config,
      currentSessionId,
    } = job.data;

    await updateImportingSessionJobId(currentSessionId, job.id);
    await handleContactRelationsFields(
      normalizedFields,
      {
        spoiledCreations,
        completedCreations,
      },
      { tenantFilter, userId, isRedis: true, generatedRegex },
      config,
      currentSessionId,
    );
  },
  {
    connection: redisConfig,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Contact Relation worker error');
});

export const createContactRelationsFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateContactRelationsFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  try {
    const isRedis = await checkRedisConnection();

    const generatedRegex = generateId();

    const completedCreations = [];
    let spoiledCreations = [];

    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      CONTACT_RELATIONS_IMPORT_IDENTIFIER,
    );
    const currentSession = await createImportingSession(
      generatedRegex,
      res?.id,
      CONTACT_RELATIONS_IMPORT_IDENTIFIER,
      tenantFilter?.tenant,
      userId,
    );

    await new Promise<void>((outerResolve, outerReject) => {
      parseAndProcessCSV(input, async (parsedRows) => {
        if (isRedis) {
          await setImportingTotalFieldsCount(
            currentSession?.regexedId,
            tenantFilter?.tenant,
            parsedRows?.length,
            CONTACT_RELATIONS_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, errors } =
            await csvContactRelationsToJSON(parsedRows);

          if (errors && errors.length > 0) {
            outerReject(
              new ApplicationError(
                'Custom: Please check headers and information correctness',
              ),
            );
            return;
          }

          spoiledCreations = spoiledFields;

          if (isRedis) {
            for (let i = 0; i < spoiledFields?.length; i++) {
              const spoiledFieldJSON = JSON.stringify(spoiledFields?.[i] ?? []);
              await updateRedisImportData(
                currentSession?.regexedId,
                tenantFilter,
                spoiledFieldJSON,
                CONTACT_RELATIONS_IMPORT_IDENTIFIER,
                spoiledImportingData,
              );
            }

            await contactRelationsImportFieldsQueue.add(
              CONTACT_RELATIONS_IMPORT_IDENTIFIER,
              {
                normalizedFields,
                spoiledCreations,
                completedCreations,
                meta: { tenantFilter, userId, isRedis, generatedRegex },
                config,
                currentSessionId: currentSession?.id,
              },
            );
          }
          outerResolve();
        } catch (err) {
          outerReject(err);
        }
      });
    })
      .then(() => {
        console.log('CSV file processing completed successfully.');
      })
      .catch((error) => {
        console.error('Error occurred during CSV processing:', error.message);
        throw new Error(error.message);
      });

    JSON.stringify({ success: true });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      CONTACT_RELATIONS_IMPORT_IDENTIFIER,
    );
  }
};
