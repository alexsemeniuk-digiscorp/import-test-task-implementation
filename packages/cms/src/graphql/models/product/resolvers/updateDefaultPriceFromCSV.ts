import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import updateDefaultPriceQueue from '../../../../api/redis/bullmq/updateDefaultPrice';
import { updateImportingSessionJobId } from '../../../../api/redis/helpers/utils/updateImportingSession';
import {
  UPDATE_DEFAULT_PRICE_IDENTIFIER,
  completedImportingData,
  spoiledImportingData,
} from '../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from '../../../../api/redis/redis';
import { checkRedisConnection } from '../../../../api/redis/redis/utils/checkRedisConnection';
import { NexusGenInputs } from '../../../../types/generated/graphql';
import { generateId } from '../../../../utils/randomBytes';
import { handleError, handleLogger } from '../../../helpers/errors';
import { handleCsvProcessingError } from '../../../helpers/importingHelpers/errorHandler';
import {
  createImportingSession,
  handleCsvUpload,
  processAndUpdateImports,
} from '../../../helpers/importingHelpers/fileHelper';
import {
  setImportingTotalFieldsCount,
  updateRedisImportData,
} from '../../../helpers/importingHelpers/redisHelpers';
import { parseAndProcessCSV } from '../../../helpers/importingHelpers/utils';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { processDefaultPriceImport } from '../helpers/updateDefaultPriceFromCSV/helpers';

const { ApplicationError } = errors;

const worker = new Worker(
  UPDATE_DEFAULT_PRICE_IDENTIFIER,
  async (job) => {
    const { productsFromCSV, meta } = job.data;
    const {
      tenantFilter,
      userId,
      lastSessionId,
      existingMap,
      generatedRegex,
      isRedis,
    } = meta;
    const existingMapInstance = new Map(Object.entries(existingMap || {}));

    try {
      const completedCreations = [];
      const spoiledCreations = [];
      const validProducts = [];

      for (const prod of productsFromCSV) {
        const existingPrice = existingMapInstance.get(String(prod.productId));
        if (existingPrice === undefined) {
          const spoiledItem = {
            productId: prod.productId,
            defaultPrice: prod.defaultPrice,
            errors: ['Product not found in DB'],
          };
          spoiledCreations.push(spoiledItem);

          if (isRedis) {
            await updateRedisImportData(
              generatedRegex,
              tenantFilter,
              JSON.stringify(spoiledItem),
              UPDATE_DEFAULT_PRICE_IDENTIFIER,
              spoiledImportingData,
            );
          }
        } else if (existingPrice !== prod.defaultPrice) {
          validProducts.push(prod);
        } else {
          const spoiledItem = {
            productId: prod.productId,
            defaultPrice: prod.defaultPrice,
            errors: ['Price unchanged'],
          };
          spoiledCreations.push(spoiledItem);

          if (isRedis) {
            await updateRedisImportData(
              generatedRegex,
              tenantFilter,
              JSON.stringify(spoiledItem),
              UPDATE_DEFAULT_PRICE_IDENTIFIER,
              spoiledImportingData,
            );
          }
        }
      }

      if (validProducts.length) {
        const ids = validProducts
          .map((p) => `'${p.productId.replace(/'/g, "''")}'`)
          .join(',');

        const caseSql = validProducts
          .map(
            (p) =>
              `WHEN '${p.productId.replace(/'/g, "''")}' THEN ${
                p.defaultPrice
              }`,
          )
          .join(' ');

        const sql = `
          UPDATE products
          SET "default_price" = CASE "product_id"
            ${caseSql}
          END
          WHERE "product_id" IN (${ids});
        `;

        await strapi.db.connection.raw(sql);

        for (const prod of validProducts) {
          const completedItem = {
            productId: prod.productId,
            defaultPrice: prod.defaultPrice,
          };
          completedCreations.push(completedItem);

          if (isRedis) {
            await updateRedisImportData(
              generatedRegex,
              tenantFilter,
              JSON.stringify(completedItem),
              UPDATE_DEFAULT_PRICE_IDENTIFIER,
              completedImportingData,
            );
          }
        }
      }

      handleLogger(
        'info',
        'Redis::UPDATE_DEFAULT_PRICE',
        `Calling processAndUpdateImports with ${completedCreations.length} completed, ${spoiledCreations.length} spoiled`,
      );

      await processAndUpdateImports(
        processDefaultPriceImport,
        lastSessionId,
        spoiledCreations,
        completedCreations,
        [],
        { userId },
        strapi.config.get('plugin.upload'),
        tenantFilter,
      );

      handleLogger(
        'info',
        'Redis::UPDATE_DEFAULT_PRICE',
        `Completed processAndUpdateImports successfully`,
      );
    } catch (err) {
      handleLogger('error', 'Redis::UPDATE_DEFAULT_PRICE', err.message);

      if (lastSessionId) {
        await strapi.entityService.update(
          'api::importing-session.importing-session',
          lastSessionId,
          { data: { state: 'error' } },
        );
      }
    }
  },
  { connection: redisConfig },
);

worker.on('error', (err) => {
  handleLogger(
    'error',
    'Redis::UPDATE_DEFAULT_PRICE',
    `Worker error: ${err.message}`,
  );
});

export const updateDefaultPriceFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['UpdateDefaultPriceFromCSVInput'] }
> = async (_, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const tenantFilter = await getTenantFilter(userId);

  try {
    const isRedis = await checkRedisConnection();
    const generatedRegex = generateId();
    const config = strapi.config.get('plugin.upload');

    const uploadResult = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      UPDATE_DEFAULT_PRICE_IDENTIFIER,
    );

    const currentSession = await createImportingSession(
      generatedRegex,
      uploadResult?.id,
      UPDATE_DEFAULT_PRICE_IDENTIFIER,
      tenantFilter?.tenant,
      userId,
    );

    await new Promise<void>((outerResolve, outerReject) => {
      parseAndProcessCSV(input, async (parsedRows) => {
        if (parsedRows?.length <= 1) {
          outerReject(new ApplicationError('Empty CSV file.'));
          return;
        }

        if (isRedis) {
          await setImportingTotalFieldsCount(
            currentSession?.regexedId,
            tenantFilter?.tenant,
            parsedRows.length,
            UPDATE_DEFAULT_PRICE_IDENTIFIER,
          );
        }

        try {
          const [headers, ...rows] = parsedRows;

          const headerIndex = {
            productId: headers.findIndex((h) =>
              h.toLowerCase().includes('product id'),
            ),
            defaultPrice: headers.findIndex(
              (h) =>
                h.toLowerCase().includes('default price') ||
                h.toLowerCase().includes('price'),
            ),
          };

          const productsFromCSV = rows
            .map((row) => ({
              productId: row[headerIndex.productId]?.trim(),
              defaultPrice: parseFloat(row[headerIndex.defaultPrice]),
            }))
            .filter((p) => p.productId && !isNaN(p.defaultPrice));

          if (!productsFromCSV.length) {
            outerReject(
              new ApplicationError(
                'No valid Product ID/Default Price pairs found in CSV.',
              ),
            );
            return;
          }

          const existingProducts = await strapi.entityService.findMany(
            'api::product.product',
            {
              filters: { ...tenantFilter },
              fields: ['id', 'productId', 'defaultPrice'],
            },
          );

          const existingMap = new Map(
            existingProducts.map((p) => [String(p.productId), p.defaultPrice]),
          );

          const productsToUpdate = productsFromCSV.filter((p) => {
            const existingPrice = existingMap.get(String(p.productId));
            return (
              existingPrice !== undefined && existingPrice !== p.defaultPrice
            );
          });

          if (productsToUpdate.length === 0) {
            outerReject(new ApplicationError('No default prices to update.'));
            return;
          }

          const job = await updateDefaultPriceQueue.add(
            UPDATE_DEFAULT_PRICE_IDENTIFIER,
            {
              productsFromCSV,
              meta: {
                tenantFilter,
                userId,
                lastSessionId: currentSession?.id,
                existingMap: Object.fromEntries(existingMap),
                generatedRegex,
                isRedis,
              },
            },
          );

          await updateImportingSessionJobId(currentSession.id, job.id);

          outerResolve();
        } catch (err) {
          handleLogger(
            'error',
            'CSV_PROCESS',
            `Error during CSV processing: ${err.message}`,
          );
          outerReject(err);
        }
      });
    });

    handleLogger(
      'info',
      'updateDefaultPriceFromCSV',
      'CSV queued successfully.',
    );

    return JSON.stringify({
      success: true,
      message: 'CSV queued successfully.',
    });
  } catch (e) {
    await handleCsvProcessingError(
      e,
      tenantFilter?.tenant,
      UPDATE_DEFAULT_PRICE_IDENTIFIER,
    );

    handleError('updateDefaultPriceFromCSV', e.message, e, true);
    return JSON.stringify({ success: false, message: e.message });
  }
};
