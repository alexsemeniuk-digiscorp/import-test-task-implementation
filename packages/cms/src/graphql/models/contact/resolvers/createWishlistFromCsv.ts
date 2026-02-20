import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from '../../../../types/generated/graphql';
import wishlistImportFieldsQueue from './../../../../api/redis/bullmq/wishlist';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import { WISHLIST_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
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
import { csvWishlistToJSON } from './../../contact/helpers/createWishlistFromCSV/csvWishlistToJSON';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';
import { handleNormalisedWishlistFields } from './../helpers/createWishlistFromCSV/handleNormalisedWishlistFields';

const { ApplicationError } = errors;

const worker = new Worker(
  WISHLIST_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      completedCreations,
      spoiledCreations,
      meta: { tenantFilter, userId, generatedRegex },
      maxCounts: { maxWishlistProductsCount },
      config,
      currentSessionId,
    } = job.data;

    await updateImportingSessionJobId(currentSessionId, job.id);
    await handleNormalisedWishlistFields(
      normalizedFields,
      {
        spoiledCreations,
        completedCreations,
      },
      { tenantFilter, userId, isRedis: true, generatedRegex },
      {
        maxWishlistProductsCount,
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
  handleLogger('info', 'Redis', 'Wishlist worker error');
});

export const createWishlistFromCsv: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateWishlistFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);
  try {
    const isRedis = await checkRedisConnection();
    const generatedRegex = generateId();

    const completedCreations = [];
    let spoiledCreations = [];

    let maxWishlistProductsCount = 0;

    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      WISHLIST_IMPORT_IDENTIFIER,
    );
    const currentSession = await createImportingSession(
      generatedRegex,
      res?.id,
      WISHLIST_IMPORT_IDENTIFIER,
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
            WISHLIST_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, errors } =
            await csvWishlistToJSON(parsedRows);

          if (errors && errors.length > 0) {
            outerReject(
              new ApplicationError(
                'Custom: Please check headers and information correctness',
              ),
            );
            return;
          }

          [...normalizedFields, ...spoiledFields].forEach((field) => {
            if (field.products.length > maxWishlistProductsCount) {
              maxWishlistProductsCount = field.products.length;
            }
          });
          spoiledCreations = spoiledFields;

          if (isRedis) {
            await updateImportingMetadata(
              currentSession?.regexedId,
              tenantFilter?.tenant,
              spoiledFields,
              {
                maxWishlistProductsCount,
              },
              WISHLIST_IMPORT_IDENTIFIER,
            );

            await wishlistImportFieldsQueue.add(WISHLIST_IMPORT_IDENTIFIER, {
              normalizedFields,
              spoiledCreations,
              completedCreations,
              meta: { tenantFilter, userId, isRedis, generatedRegex },
              maxCounts: {
                maxWishlistProductsCount,
              },
              config,
              currentSessionId: currentSession?.id,
            });
          }

          if (!isRedis) {
            await handleNormalisedWishlistFields(
              normalizedFields,
              { spoiledCreations, completedCreations },
              {
                tenantFilter,
                userId,
                isRedis,
                generatedRegex: currentSession?.regexedId,
              },
              {
                maxWishlistProductsCount,
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
      .catch((error) => {
        console.error('Error occurred during CSV processing:', error.message);
        throw new Error(error.message);
      });

    JSON.stringify({ success: true });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      WISHLIST_IMPORT_IDENTIFIER,
    );
  }
};
