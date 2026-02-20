import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../api/redis/redis';
import { handleLogger } from './../../../../helpers/errors';
import { stringNormalizer } from './../../../../helpers/formatter';
import { processAndUpdateImports } from './../../../../helpers/importingHelpers/fileHelper';
import { processContactsRelationsImport } from './../../helpers/createContactRelationsFromCSV/processContactRelations';
import { handleCompletedCreations } from './../createContactRelationsFromCSV/handleNormalizedFields/handleCompletedCreations';
import { handleSpoiledCreations } from './../createContactRelationsFromCSV/handleNormalizedFields/handleSpoiledCreations';
import {
  batchFindContactsForRelations,
  batchFindOrCreateRelationTypes,
} from './batchHelpers';

export const handleContactRelationsFields = async (
  normalizedFields,
  { spoiledCreations, completedCreations },
  { tenantFilter, userId, isRedis, generatedRegex },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  // Initialize metrics tracking
  const metrics = {
    totalRelations: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    relationTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[CONTACT RELATIONS IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalRelations} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const [contactsMap, relationTypesMap] = await Promise.all([
        batchFindContactsForRelations(normalizedFields, tenantFilter?.tenant),
        batchFindOrCreateRelationTypes(normalizedFields, tenantFilter?.tenant),
      ]);

      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[CONTACT RELATIONS IMPORT] Processing ${normalizedFields.length} relations with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      // Process each contact relation with Map-based lookups instead of queries
      const processContactRelation = async (
        parsedContactRelation: any,
        index: number,
      ): Promise<void> => {
        const relationStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Check if processing was cancelled (periodic check, not every relation)
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

          // Use prefetched contactsMap instead of database queries (O(1) lookups)
          const fromContactEmail = stringNormalizer(
            parsedContactRelation?.fromContact || '',
          );
          const toContactEmail = stringNormalizer(
            parsedContactRelation?.toContact || '',
          );

          const existedFromContact = contactsMap.get(fromContactEmail);
          const existedToContact = contactsMap.get(toContactEmail);

          const existedFromContactEmails = existedFromContact
            ? [existedFromContact]
            : [];
          const existedToContactEmails = existedToContact
            ? [existedToContact]
            : [];

          // Use prefetched relationTypesMap instead of database query/create (O(1) lookup)
          let relationTypeId = undefined;
          if (parsedContactRelation?.relationType) {
            const relationType = relationTypesMap.get(
              parsedContactRelation.relationType.trim(),
            );
            relationTypeId = relationType?.id;
          }

          // Route to appropriate handler based on validation
          if (
            !existedFromContactEmails?.length ||
            !existedToContactEmails?.length
          ) {
            await handleSpoiledCreations({
              parsedContactRelation,
              existedFromContactEmails,
              existedToContactEmails,
              spoiledCreations,
              isRedis,
              generatedRegex,
              tenantFilter,
            });
            metrics.spoiled++;
          } else if (
            existedFromContactEmails?.length &&
            existedToContactEmails?.length
          ) {
            await handleCompletedCreations(parsedContactRelation, {
              completedCreations,
              existedFromContactEmailsId: existedFromContactEmails[0].id,
              existedToContactEmailsId: existedToContactEmails[0].id,
              relationTypeId,
              isRedis,
              generatedRegex,
              tenantFilter,
              spoiledCreations,
            });
            metrics.completed++;
          }
        } catch (innerError) {
          handleLogger(
            'error',
            'handleContactRelationsFields',
            `Error processing relation at index ${index}: ${JSON.stringify(
              parsedContactRelation,
            )}`,
          );
          metrics.spoiled++;
        } finally {
          metrics.active--;
          metrics.processed++;
          const relationTime = Date.now() - relationStart;
          metrics.relationTimes.push(relationTime);

          // Log progress every 10 relations or at completion
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalRelations
          ) {
            logProgress();
          }
        }
      };

      // Process all contact relations with controlled concurrency
      await Promise.allSettled(
        normalizedFields.map((relation, index) =>
          limit(() => processContactRelation(relation, index)),
        ),
      );

      // Final metrics logging
      console.log(`[CONTACT RELATIONS IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.relationTimes.length > 0) {
        const avgTime = (
          metrics.relationTimes.reduce((a, b) => a + b, 0) /
          metrics.relationTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.relationTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.relationTimes) / 1000).toFixed(2);
        console.log(
          `[CONTACT RELATIONS IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per relation`,
        );
      }
    }

    const options = {
      userId,
    };

    await processAndUpdateImports(
      processContactsRelationsImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      null,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleContactRelationsFields', undefined, e);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const relationsAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleContactRelationsFields took ${seconds}s`);
    console.log(`${Number(seconds) / relationsAmount}s per relation`);
  }
};
