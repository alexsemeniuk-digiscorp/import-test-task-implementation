import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from '../../../../types/generated/graphql';
import ordersImportFieldsQueue from './../../../../api/redis/bullmq/orders';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import { ORDERS_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { checkRedisConnection } from './../../../../api/redis/redis/utils/checkRedisConnection';
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
import { csvOrdersToJSON } from './../helpers/importing/utils/csvOrdersToJSON';
import { handleNormalisedOrdersFields } from './../helpers/importing/utils/handleOrdersNormalizedFields';

const { ApplicationError } = errors;

const worker = new Worker(
  ORDERS_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      completedCreations,
      spoiledCreations,
      meta: { createModeOn, tenantFilter, userId, generatedRegex },
      maxCounts: { maxProductsCount, maxImagesCount, maxSerialNumbersCount },
      config,
      currentSessionId,
    } = job.data;

    await updateImportingSessionJobId(currentSessionId, job.id);

    await handleNormalisedOrdersFields(
      normalizedFields,
      {
        spoiledCreations,
        completedCreations,
      },
      {
        createModeOn,
        tenantFilter,
        userId,
        isRedis: true,
        generatedRegex,
      },
      {
        maxProductsCount,
        maxImagesCount,
        maxSerialNumbersCount,
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
  handleLogger('info', 'Redis', 'Order worker error');
});

export const createOrdersFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateOrdersFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  try {
    const completedCreations = [];
    let spoiledCreations = [];
    const createModeOn = input?.createNewMode;
    let maxProductsCount = 0;
    let maxImagesCount = 0;
    let maxSerialNumbersCount = 0;
    const isRedis = await checkRedisConnection();

    const generatedRegex = generateId();
    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      ORDERS_IMPORT_IDENTIFIER,
    );
    const currentSession = await createImportingSession(
      generatedRegex,
      res?.id,
      ORDERS_IMPORT_IDENTIFIER,
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
            ORDERS_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, errors } =
            await csvOrdersToJSON(parsedRows);

          if (errors && errors.length > 0) {
            outerReject(
              new ApplicationError(
                'Custom: Please check headers and information correctness',
              ),
            );
            return;
          }

          [...normalizedFields, ...spoiledFields].forEach((field) => {
            if (field.products.length > maxProductsCount) {
              maxProductsCount = field.products.length;
            }
            if (field.images.length > maxImagesCount) {
              maxImagesCount = field.images.length;
            }

            if (field?.productItems?.length) {
              field.products.forEach((product) => {
                if (
                  product.serialNumbers?.length &&
                  product.serialNumbers.length > maxSerialNumbersCount
                ) {
                  maxSerialNumbersCount = product.serialNumbers.length;
                }
              });
            }
          });
          spoiledCreations = spoiledFields;

          if (isRedis) {
            await updateImportingMetadata(
              currentSession?.regexedId,
              tenantFilter?.tenant,
              spoiledFields,
              {
                maxProductsCount,
                maxImagesCount,
              },
              ORDERS_IMPORT_IDENTIFIER,
            );

            await ordersImportFieldsQueue.add(ORDERS_IMPORT_IDENTIFIER, {
              normalizedFields,
              completedCreations,
              spoiledCreations,
              meta: {
                tenantFilter,
                userId,
                isRedis,
                generatedRegex,
                createModeOn,
              },
              maxCounts: {
                maxProductsCount,
                maxImagesCount,
                maxSerialNumbersCount,
              },
              config,
              currentSessionId: currentSession?.id,
            });
          }

          outerResolve();
        } catch (error) {
          outerReject(error);
        }
      });
    });

    JSON.stringify({ success: true });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      ORDERS_IMPORT_IDENTIFIER,
    );
  }
};
