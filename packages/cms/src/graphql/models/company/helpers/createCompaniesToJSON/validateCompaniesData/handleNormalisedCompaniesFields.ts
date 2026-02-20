import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../api/redis/redis';
import { DEFAULT_EMAIL } from './../../../../../constants/defaultValues';
import { handleLogger } from './../../../../../helpers/errors';
import { stringNormalizer } from './../../../../../helpers/formatter';
import { processAndUpdateImports } from './../../../../../helpers/importingHelpers/fileHelper';
import { handleCompletedCreations } from './../../../helpers/createCompaniesToJSON/validateCompaniesData/handleNormalisedCompaniesFields/handleCompletedCreations';
import { handleNeedChangeCreations } from './../../../helpers/createCompaniesToJSON/validateCompaniesData/handleNormalisedCompaniesFields/handleNeedChangeCreations';
import { handleSpoiledCreations } from './../../../helpers/createCompaniesToJSON/validateCompaniesData/handleNormalisedCompaniesFields/handleSpoiledCreations';
import { processCompaniesImport } from './../../../helpers/createCompaniesToJSON/validateCompaniesData/handleNormalisedCompaniesFields/processCompaniesImport';
import {
  batchFindAvatarFiles,
  batchFindCompanies,
} from './handleNormalisedCompaniesFields/batchHelpers';

export const handleNormalisedCompaniesFields = async (
  normalizedFields,
  { spoiledCreations, needChangeCreations, completedCreations },
  { tenantFilter, userId, isRedis, generatedRegex },
  { maxNotesCount },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  // Initialize metrics tracking
  const metrics = {
    totalCompanies: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    needChange: 0,
    companyTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[COMPANY IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalCompanies} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled} | ` +
        `NeedChange: ${metrics.needChange}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const [companiesMap, avatarFilesMap] = await Promise.all([
        batchFindCompanies(normalizedFields, tenantFilter?.tenant),
        batchFindAvatarFiles(normalizedFields),
      ]);

      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[COMPANY IMPORT] Processing ${normalizedFields.length} companies with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      // Process each company with Map-based lookups instead of queries
      const processCompany = async (
        parsedCompany: any,
        index: number,
      ): Promise<void> => {
        const companyStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Check if processing was cancelled (periodic check, not every company)
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

          // Use prefetched companiesMap instead of database query (O(1) lookup)
          const normalizedEmail = stringNormalizer(
            parsedCompany?.email || DEFAULT_EMAIL,
          );
          const existingCompany = companiesMap.get(normalizedEmail);
          const existedContactEmails = existingCompany ? [existingCompany] : [];

          // Use prefetched avatarFilesMap instead of database query (O(1) lookup)
          let isFile = true;
          let avatarId = undefined;
          if (parsedCompany?.avatar) {
            const avatarFile = avatarFilesMap.get(String(parsedCompany.avatar));
            isFile = !!avatarFile;
            avatarId = avatarFile?.id;
          }

          // Route to appropriate handler based on validation
          if (parsedCompany?.avatar && !isFile) {
            await handleSpoiledCreations({
              parsedContact: parsedCompany,
              isFile,
              spoiledCreations,
              isRedis,
              generatedRegex,
              tenantFilter,
            });
            metrics.spoiled++;
          } else if (
            !existedContactEmails.length &&
            (!parsedCompany?.avatar || isFile)
          ) {
            await handleCompletedCreations(
              parsedCompany,
              tenantFilter,
              completedCreations,
              avatarId,
              isRedis,
              generatedRegex,
              spoiledCreations,
            );
            metrics.completed++;
          } else if (
            existedContactEmails.length &&
            (!parsedCompany?.avatar || isFile)
          ) {
            const updatingType = 'email';
            const updatingInfo = {
              emailsUuid: existedContactEmails?.[0]?.uuid,
              emailsId: existedContactEmails?.[0]?.id,
            };

            await handleNeedChangeCreations(
              parsedCompany,
              tenantFilter,
              needChangeCreations,
              updatingType,
              updatingInfo,
              avatarId,
              isRedis,
              generatedRegex,
            );
            metrics.needChange++;
          }
        } catch (innerError) {
          handleLogger(
            'error',
            'handleNormalisedCompaniesFields',
            `Error processing company at index ${index}: ${JSON.stringify(
              parsedCompany,
            )}`,
          );
          metrics.spoiled++;
        } finally {
          metrics.active--;
          metrics.processed++;
          const companyTime = Date.now() - companyStart;
          metrics.companyTimes.push(companyTime);

          // Log progress every 10 companies or at completion
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalCompanies
          ) {
            logProgress();
          }
        }
      };

      // Process all companies with controlled concurrency
      await Promise.allSettled(
        normalizedFields.map((company, index) =>
          limit(() => processCompany(company, index)),
        ),
      );

      // Final metrics logging
      console.log(`[COMPANY IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.companyTimes.length > 0) {
        const avgTime = (
          metrics.companyTimes.reduce((a, b) => a + b, 0) /
          metrics.companyTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.companyTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.companyTimes) / 1000).toFixed(2);
        console.log(
          `[COMPANY IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per company`,
        );
      }
    }

    const options = {
      maxNotesCount,
      userId,
    };

    await processAndUpdateImports(
      processCompaniesImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      needChangeCreations,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleNormalisedCompaniesFields', e.message);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const companiesAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleNormalisedCompaniesFields took ${seconds}s`);
    console.log(`${Number(seconds) / companiesAmount}s per company`);
  }
};
