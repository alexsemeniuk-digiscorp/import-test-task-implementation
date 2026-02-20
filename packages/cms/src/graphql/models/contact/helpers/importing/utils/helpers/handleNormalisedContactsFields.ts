import pLimit from 'p-limit';
import { isProcessingJob } from './../../../../../../../api/redis/helpers/variables/importingVariables';
import redis from './../../../../../../../api/redis/redis';
import { DEFAULT_EMAIL } from './../../../../../../../graphql/constants/defaultValues';
import { handleLogger } from './../../../../../../../graphql/helpers/errors';
import { stringNormalizer } from './../../../../../../../graphql/helpers/formatter';
import { processAndUpdateImports } from './../../../../../../helpers/importingHelpers/fileHelper';
import { processContactsImport } from './../../../createContactsFromCSV/generateImportReport';
import {
  handleCompletedCreations,
  handleNeedChangeCreations,
  handleSpoiledCreations,
} from './../../../importing/contactImport';
import {
  batchFindAvatarFiles,
  batchFindContacts,
  batchFindLeadOwners,
  batchFindOrCreateCustomFieldNames,
} from './batchHelpers';

export const handleNormalisedContactsFields = async (
  normalizedFields,
  { spoiledCreations, needChangeCreations, completedCreations },
  { tenantFilter, userId, isRedis, generatedRegex },
  {
    maxAdditionalAddressesCount,
    maxAdditionalPhoneNumbersCount,
    maxAdditionalEmailsCount,
    maxNotesCount,
  },
  config,
  currentSessionId,
) => {
  const start = Date.now();

  // Initialize metrics tracking
  const metrics = {
    totalContacts: normalizedFields.length,
    processed: 0,
    active: 0,
    maxActive: 0,
    completed: 0,
    spoiled: 0,
    needChange: 0,
    contactTimes: [] as number[],
  };

  const logProgress = () => {
    console.log(
      `[CONTACT IMPORT PROGRESS] Processed: ${metrics.processed}/${metrics.totalContacts} | ` +
        `Active: ${metrics.active} | MaxActive: ${metrics.maxActive} | ` +
        `Completed: ${metrics.completed} | Spoiled: ${metrics.spoiled} | ` +
        `NeedChange: ${metrics.needChange}`,
    );
  };

  try {
    if (normalizedFields.length > 0) {
      const [contactsMap, leadOwnersMap, avatarFilesMap, customFieldNamesMap] =
        await Promise.all([
          batchFindContacts(normalizedFields, tenantFilter?.tenant),
          batchFindLeadOwners(normalizedFields, tenantFilter?.tenant),
          batchFindAvatarFiles(normalizedFields),
          batchFindOrCreateCustomFieldNames(
            normalizedFields,
            tenantFilter?.tenant,
            'contact',
          ),
        ]);

      const CONCURRENCY_LIMIT = 20;
      const limit = pLimit(CONCURRENCY_LIMIT);

      console.log(
        `[CONTACT IMPORT] Processing ${normalizedFields.length} contacts with concurrency limit: ${CONCURRENCY_LIMIT}`,
      );

      // Process each contact with Map-based lookups instead of queries
      const processContact = async (
        parsedContact: any,
        index: number,
      ): Promise<void> => {
        const contactStart = Date.now();
        metrics.active++;
        metrics.maxActive = Math.max(metrics.maxActive, metrics.active);

        try {
          // Check if processing was cancelled (periodic check, not every contact)
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
          const normalizedEmail = stringNormalizer(
            parsedContact?.email || DEFAULT_EMAIL,
          );
          const existingContact = contactsMap.get(normalizedEmail);
          const existedContactEmails = existingContact ? [existingContact] : [];

          // Use prefetched leadOwnersMap instead of database query (O(1) lookup)
          let leadOwnerId = undefined;
          let isLeadValid = true;
          if (parsedContact?.leadOwner) {
            const leadOwner = leadOwnersMap.get(parsedContact.leadOwner.trim());
            leadOwnerId = leadOwner?.id;
            isLeadValid = !!leadOwner;
          }

          // Use prefetched avatarFilesMap instead of database query (O(1) lookup)
          let isFile = true;
          let avatarId = undefined;
          if (parsedContact?.avatar) {
            const avatarFile = avatarFilesMap.get(String(parsedContact.avatar));
            isFile = !!avatarFile;
            avatarId = avatarFile?.id;
          }

          // Route to appropriate handler based on validation
          if ((parsedContact?.avatar && !isFile) || !isLeadValid) {
            await handleSpoiledCreations({
              parsedContact,
              isFile,
              spoiledCreations,
              isLeadValid,
              isRedis,
              generatedRegex,
              tenantFilter,
            });
            metrics.spoiled++;
          } else if (
            !existedContactEmails.length &&
            (!parsedContact?.avatar || isFile) &&
            isLeadValid
          ) {
            await handleCompletedCreations(
              parsedContact,
              tenantFilter,
              completedCreations,
              leadOwnerId,
              avatarId,
              isRedis,
              generatedRegex,
              spoiledCreations,
              customFieldNamesMap,
            );
            metrics.completed++;
          } else if (
            existedContactEmails.length &&
            (!parsedContact?.avatar || isFile) &&
            isLeadValid
          ) {
            const updatingType = 'email';
            const updatingInfo = {
              emailsUuid: existedContactEmails?.[0]?.uuid,
              emailsId: existedContactEmails?.[0]?.id,
            };

            await handleNeedChangeCreations(
              parsedContact,
              tenantFilter,
              needChangeCreations,
              updatingType,
              updatingInfo,
              leadOwnerId,
              avatarId,
              isRedis,
              generatedRegex,
            );
            metrics.needChange++;
          }
        } catch (innerError) {
          handleLogger(
            'error',
            'handleNormalisedContactsFields',
            `Error processing contact at index ${index}: ${JSON.stringify(
              parsedContact,
            )}`,
          );
          metrics.spoiled++;
        } finally {
          metrics.active--;
          metrics.processed++;
          const contactTime = Date.now() - contactStart;
          metrics.contactTimes.push(contactTime);

          // Log progress every 10 contacts or at completion
          if (
            metrics.processed % 10 === 0 ||
            metrics.processed === metrics.totalContacts
          ) {
            logProgress();
          }
        }
      };

      // Process all contacts with controlled concurrency
      await Promise.allSettled(
        normalizedFields.map((contact, index) =>
          limit(() => processContact(contact, index)),
        ),
      );

      // Final metrics logging
      console.log(`[CONTACT IMPORT COMPLETE] Final metrics:`);
      logProgress();

      if (metrics.contactTimes.length > 0) {
        const avgTime = (
          metrics.contactTimes.reduce((a, b) => a + b, 0) /
          metrics.contactTimes.length /
          1000
        ).toFixed(2);
        const minTime = (Math.min(...metrics.contactTimes) / 1000).toFixed(2);
        const maxTime = (Math.max(...metrics.contactTimes) / 1000).toFixed(2);
        console.log(
          `[CONTACT IMPORT TIMING] Avg: ${avgTime}s | Min: ${minTime}s | Max: ${maxTime}s per contact`,
        );
      }
    }

    const options = {
      maxAdditionalAddressesCount,
      maxAdditionalPhoneNumbersCount,
      maxAdditionalEmailsCount,
      maxNotesCount,
      userId,
    };

    await processAndUpdateImports(
      processContactsImport,
      currentSessionId,
      spoiledCreations,
      completedCreations,
      needChangeCreations,
      options,
      config,
      tenantFilter,
    );
  } catch (e) {
    handleLogger('error', 'handleNormalisedContactsFields', e.message);
  } finally {
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    const contactsAmount =
      normalizedFields.length > 0 ? normalizedFields.length : 1;

    console.log(`handleNormalisedContactsFields took ${seconds}s`);
    console.log(`${Number(seconds) / contactsAmount}s per contact`);
  }
};
