import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { checkRedisConnection } from '../../../../api/redis/redis/utils/checkRedisConnection';

import { NexusGenInputs } from '../../../../types/generated/graphql';
import companiesImportFieldsQueue from './../../../../api/redis/bullmq/companies';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import { COMPANIES_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { generateId } from './../../../../utils/randomBytes';
import { handleLogger } from './../../../helpers/errors';
import { handleCsvProcessingError } from './../../../helpers/importingHelpers/errorHandler';
import {
  createImportingSession,
  handleCsvUpload,
} from './../../../helpers/importingHelpers/fileHelper';
import {
  setImportingTotalFieldsCount,
  updateImportingMetadata,
} from './../../../helpers/importingHelpers/redisHelpers';
import { parseAndProcessCSV } from './../../../helpers/importingHelpers/utils';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';
import { createCompaniesToJSON } from './../helpers/createCompaniesToJSON';
import { handleNormalisedCompaniesFields } from './../helpers/createCompaniesToJSON/validateCompaniesData/handleNormalisedCompaniesFields';
const { ApplicationError } = errors;

const worker = new Worker(
  COMPANIES_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      completedCreations,
      spoiledCreations,
      needChangeCreations,
      meta: { tenantFilter, userId, generatedRegex },
      maxCounts: { maxNotesCount },
      config,
      currentSessionId,
    } = job.data;
    await updateImportingSessionJobId(currentSessionId, job.id);
    await handleNormalisedCompaniesFields(
      normalizedFields,
      {
        completedCreations,
        spoiledCreations,
        needChangeCreations,
      },
      { tenantFilter, userId, isRedis: true, generatedRegex },
      {
        maxNotesCount,
      },
      config,
      currentSessionId,
    );
  },
  {
    connection: redisConfig,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Contact worker error');
});

export const createCompaniesFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateContactsFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  try {
    const completedCreations = [];
    const needChangeCreations = [];
    let spoiledCreations = [];
    let maxNotesCount = 0;
    const isRedis = await checkRedisConnection();

    const generatedRegex = generateId();
    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      COMPANIES_IMPORT_IDENTIFIER,
    );
    const currentSession = await createImportingSession(
      generatedRegex,
      res?.id,
      COMPANIES_IMPORT_IDENTIFIER,
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
            COMPANIES_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, errors } =
            await createCompaniesToJSON(parsedRows);

          if (errors && errors.length > 0) {
            outerReject(
              new ApplicationError(
                'Custom: Headers in file did not match template',
              ),
            );
            return;
          }

          [...normalizedFields, ...spoiledFields].forEach((field) => {
            if (field?.notes?.length && field.notes.length > maxNotesCount) {
              maxNotesCount = field.notes.length;
            }
          });

          spoiledCreations = spoiledFields;

          if (isRedis) {
            await updateImportingMetadata(
              currentSession?.regexedId,
              tenantFilter?.tenant,
              spoiledFields,
              {
                maxNotesCount,
              },
              COMPANIES_IMPORT_IDENTIFIER,
            );

            await companiesImportFieldsQueue.add(COMPANIES_IMPORT_IDENTIFIER, {
              normalizedFields,
              spoiledCreations,
              completedCreations,
              needChangeCreations,
              meta: { tenantFilter, userId, isRedis, generatedRegex },
              maxCounts: {
                maxNotesCount,
              },
              config,
              currentSessionId: currentSession?.id,
            });
          }

          if (!isRedis) {
            await handleNormalisedCompaniesFields(
              normalizedFields,
              { spoiledCreations, completedCreations, needChangeCreations },
              {
                tenantFilter,
                userId,
                isRedis,
                generatedRegex: currentSession?.regexedId,
              },
              {
                maxNotesCount,
              },
              config,
              currentSession?.id,
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
      .catch(async (error) => {
        throw new Error(error.message);
      });

    JSON.stringify({ success: true });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      COMPANIES_IMPORT_IDENTIFIER,
    );
  }
};
