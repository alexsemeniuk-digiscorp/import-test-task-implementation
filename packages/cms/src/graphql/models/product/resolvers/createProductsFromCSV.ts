import { errors } from '@strapi/utils';
import { GraphQLFieldResolver } from 'graphql';
import { checkRedisConnection } from '../../../../api/redis/redis/utils/checkRedisConnection';
import { csvProductsToJSON } from '../helpers/importing/utils/helpers/csvProductsToJSON';
import { PRODUCTS_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { NexusGenInputs } from './../../../../types/generated/graphql';
import { generateId } from './../../../../utils/randomBytes';
import { handleError, handleLogger } from './../../../helpers/errors';
import { parseAndProcessCSV } from './../../../helpers/importingHelpers/utils';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';
import { handleNormalisedProductsFields } from './../helpers/importing/utils/helpers/handleNormalisedFields';

import { Worker } from 'bullmq';
import productsImportFieldsQueue from './../../../../api/redis/bullmq/products';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import { handleCsvProcessingError } from './../../../helpers/importingHelpers/errorHandler';
import {
  createImportingSession,
  handleCsvUpload,
} from './../../../helpers/importingHelpers/fileHelper';
import {
  setImportingTotalFieldsCount,
  updateImportingMetadata,
} from './../../../helpers/importingHelpers/redisHelpers';

const { ApplicationError } = errors;

const worker = new Worker(
  PRODUCTS_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      completedCreations,
      needChangeCreations,
      spoiledCreations,
      meta: { tenantFilter, userId, generatedRegex, customFieldsArr },
      maxCounts: { maxProductsCount, maxImagesCount, maxSerialNumbersCount },
      config,
      currentSessionId,
    } = job.data;
    await updateImportingSessionJobId(currentSessionId, job.id);

    await handleNormalisedProductsFields(
      normalizedFields,
      {
        spoiledCreations,
        completedCreations,
        needChangeCreations,
      },
      { tenantFilter, userId, isRedis: true, generatedRegex },
      {
        maxImagesCount,
        customFieldsArr,
        maxProductsCount,
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
  handleLogger('info', 'Redis', 'Product worker error');
});

export const createProductsFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateProductsFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const tenantFilter = await getTenantFilter(userId);
  try {
    const completedCreations = [];
    const needChangeCreations = [];
    let spoiledCreations = [];
    let maxProductsCount = 0;
    let maxImagesCount = 0;
    let maxSerialNumbersCount = 0;
    const isRedis = await checkRedisConnection();
    const generatedRegex = generateId();
    let customFieldsArr = [];

    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      PRODUCTS_IMPORT_IDENTIFIER,
    );
    const currentSession = await createImportingSession(
      generatedRegex,
      res?.id,
      PRODUCTS_IMPORT_IDENTIFIER,
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
            PRODUCTS_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, errors, customFieldsNames } =
            await csvProductsToJSON(parsedRows);

          if (errors && errors.length > 0) {
            outerReject(
              new ApplicationError(
                'Custom: Please check headers and information correctness',
              ),
            );
            return;
          }

          [...normalizedFields, ...spoiledFields].forEach((item) => {
            if (item?.images?.length > maxImagesCount) {
              maxImagesCount = item.images.length;
            }

            if (item?.productItems?.length > maxProductsCount) {
              maxProductsCount = item.productItems.length;
            }

            if (item?.productItems?.length) {
              item.productItems.forEach(
                (product: { serialNumbers: string[] }) => {
                  if (
                    product.serialNumbers?.length &&
                    product.serialNumbers.length > maxSerialNumbersCount
                  ) {
                    maxSerialNumbersCount = product.serialNumbers.length;
                  }
                },
              );
            }
          });

          spoiledCreations = spoiledFields;
          customFieldsArr = customFieldsNames;

          if (isRedis) {
            await updateImportingMetadata(
              currentSession?.regexedId,
              tenantFilter?.tenant,
              spoiledFields,
              {
                maxProductsCount,
                maxImagesCount,
                maxSerialNumbersCount,
                customFieldsArr,
              },
              PRODUCTS_IMPORT_IDENTIFIER,
            );

            await productsImportFieldsQueue.add(PRODUCTS_IMPORT_IDENTIFIER, {
              normalizedFields,
              spoiledCreations,
              completedCreations,
              needChangeCreations,
              meta: {
                tenantFilter,
                userId,
                isRedis: true,
                generatedRegex,
                customFieldsArr,
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
    })
      .then(() => {
        handleLogger(
          'info',
          'createProductsFromCSV',
          'CSV file processing completed successfully.',
        );
      })
      .catch((error) => {
        handleError('createProductsFromCSV', undefined, error);
      });

    return JSON.stringify({ success: true });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      PRODUCTS_IMPORT_IDENTIFIER,
    );
  }
};
