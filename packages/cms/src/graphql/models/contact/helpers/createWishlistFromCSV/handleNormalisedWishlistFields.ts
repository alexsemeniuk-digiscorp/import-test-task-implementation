import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../api/redis/redis';
import { processWishlistImport } from './../../../../../graphql/models/contact/helpers/createWishlistFromCSV/processWishlist';
import { handleLogger } from './../../../../helpers/errors';
import { stringNormalizer } from './../../../../helpers/formatter';
import { processAndUpdateImports } from './../../../../helpers/importingHelpers/fileHelper';
import { handleCompletedCreations } from './../../../contact/helpers/createWishlistFromCSV/handleNormalizedFields/handleCompletedCreations';
import { handleSpoiledCreations } from './../createWishlistFromCSV/handleNormalizedFields/handleSpoiledCreations';
import {
  batchFindContactsForWishlist,
  batchFindProductsForWishlist,
} from './batchHelpers';

export const handleNormalisedWishlistFields = async (
  normalizedFields,
  { spoiledCreations, completedCreations },
  { tenantFilter, userId, isRedis, generatedRegex },
  { maxWishlistProductsCount },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  // Initialize metrics tracking
  const metrics = {
    totalWishlistItems: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    wishlistTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[WISHLIST IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalWishlistItems} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const [contactsMap, productsMap] = await Promise.all([
        batchFindContactsForWishlist(normalizedFields, tenantFilter?.tenant),
        batchFindProductsForWishlist(normalizedFields),
      ]);

      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[WISHLIST IMPORT] Processing ${normalizedFields.length} items with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      // Process each wishlist item with Map-based lookups instead of queries
      const processWishlistItem = async (
        parsedWishlistItem: any,
        index: number,
      ): Promise<void> => {
        const wishlistStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Check if processing was cancelled (periodic check, not every item)
          if (index % 10 === 0) {
            const result = isProcessingJob(
              generatedRegex,
              tenantFilter?.tenant,
            );
            const value = await redis.get(result);
            if (value === 'false') {
              return;
            }
          }

          // Use prefetched contactsMap instead of database query (O(1) lookup)
          const contactEmail = stringNormalizer(
            parsedWishlistItem?.contact || '',
          );
          const existedContact = contactsMap.get(contactEmail);
          const existedContactEmails = existedContact ? [existedContact] : [];

          // Use prefetched productsMap to validate all products (O(1) lookups)
          let isAllProductsExists = true;
          if (parsedWishlistItem?.products?.length > 0) {
            const uniqueProducts = Array.from(
              new Set(parsedWishlistItem.products.filter(Boolean)),
            );
            const foundProducts = uniqueProducts.filter((productId) =>
              productsMap.has(productId as string),
            );
            isAllProductsExists =
              foundProducts.length === uniqueProducts.length;
          }

          // Route to appropriate handler based on validation
          if (!existedContactEmails?.length || !isAllProductsExists) {
            await handleSpoiledCreations({
              parsedWishlistItem,
              existedContactEmails,
              isAllProductsExists,
              spoiledCreations,
              isRedis,
              generatedRegex,
              tenantFilter,
            });
            metrics.spoiled++;
          } else if (existedContactEmails?.length && isAllProductsExists) {
            await handleCompletedCreations(parsedWishlistItem, {
              completedCreations,
              existedContact: existedContactEmails[0], // Pass full contact with todos
              productsMap, // Pass prefetched products map
              tenantFilter,
              isRedis,
              generatedRegex,
              spoiledCreations,
            });
            metrics.completed++;
          }
        } catch (innerError) {
          handleLogger(
            'error',
            'handleNormalisedWishlistFields',
            `Error processing wishlist item at index ${index}: ${JSON.stringify(
              parsedWishlistItem,
            )}`,
          );
          metrics.spoiled++;
        } finally {
          metrics.active--;
          metrics.processed++;
          const wishlistTime = Date.now() - wishlistStart;
          metrics.wishlistTimes.push(wishlistTime);

          // Log progress every 10 items or at completion
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalWishlistItems
          ) {
            logProgress();
          }
        }
      };

      // Process all wishlist items with controlled concurrency
      await Promise.allSettled(
        normalizedFields.map((item, index) =>
          limit(() => processWishlistItem(item, index)),
        ),
      );

      // Final metrics logging
      console.log(`[WISHLIST IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.wishlistTimes.length > 0) {
        const avgTime = (
          metrics.wishlistTimes.reduce((a, b) => a + b, 0) /
          metrics.wishlistTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.wishlistTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.wishlistTimes) / 1000).toFixed(2);
        console.log(
          `[WISHLIST IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per item`,
        );
      }
    }

    const options = {
      userId,
      maxWishlistProductsCount,
    };

    await processAndUpdateImports(
      processWishlistImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      null,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleNormalisedWishlistFields', undefined, e);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const wishlistsAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleNormalisedWishlistFields took ${seconds}s`);
    console.log(`${Number(seconds) / wishlistsAmount}s per wishlist`);
  }
};
