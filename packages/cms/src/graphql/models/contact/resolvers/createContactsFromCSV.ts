import { errors } from '@strapi/utils';
import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { checkRedisConnection } from '../../../../api/redis/redis/utils/checkRedisConnection';

import { NexusGenInputs } from '../../../../types/generated/graphql';
import contactsImportFieldsQueue from './../../../../api/redis/bullmq/contacts';
import { updateImportingSessionJobId } from './../../../../api/redis/helpers/utils/updateImportingSession';
import { CONTACTS_IMPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/importingVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { handleNormalisedContactsFields } from './../../../../graphql/models/contact/helpers/importing/utils/helpers/handleNormalisedContactsFields';
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
import { csvContactsToJSON } from './../helpers/importing/utils/helpers/csvContactsToJSON';

const { ApplicationError } = errors;

const worker = new Worker(
  CONTACTS_IMPORT_IDENTIFIER,
  async (job) => {
    const {
      normalizedFields,
      completedCreations,
      spoiledCreations,
      needChangeCreations,
      meta: { tenantFilter, userId, generatedRegex },
      maxCounts: {
        maxAdditionalAddressesCount,
        maxAdditionalPhoneNumbersCount,
        maxAdditionalEmailsCount,
        maxNotesCount,
      },
      config,
      currentSessionId,
    } = job.data;

    await updateImportingSessionJobId(currentSessionId, job.id);
    await handleNormalisedContactsFields(
      normalizedFields,
      {
        completedCreations,
        spoiledCreations,
        needChangeCreations,
      },
      { tenantFilter, userId, isRedis: true, generatedRegex },
      {
        maxAdditionalAddressesCount,
        maxAdditionalPhoneNumbersCount,
        maxAdditionalEmailsCount,
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

export const createContactsFromCSV: GraphQLFieldResolver<
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
    let maxAdditionalEmailsCount = 0;
    let maxAdditionalPhoneNumbersCount = 0;
    let maxAdditionalAddressesCount = 0;
    let customFieldsArr = [];
    const isRedis = await checkRedisConnection();

    const generatedRegex = generateId();
    const config = strapi.config.get('plugin.upload');
    const res = await handleCsvUpload(
      input?.uploadCsv,
      config,
      userId,
      CONTACTS_IMPORT_IDENTIFIER,
    );

    let currentSession;
    try {
      currentSession = await createImportingSession(
        generatedRegex,
        res?.id,
        CONTACTS_IMPORT_IDENTIFIER,
        tenantFilter?.tenant,
        userId,
      );
    } catch (e) {
      console.log(e);
    }

    await new Promise<void>((outerResolve, outerReject) => {
      parseAndProcessCSV(input, async (parsedRows) => {
        if (isRedis) {
          await setImportingTotalFieldsCount(
            currentSession?.regexedId,
            tenantFilter?.tenant,
            parsedRows?.length,
            CONTACTS_IMPORT_IDENTIFIER,
          );
        }
        try {
          const { spoiledFields, normalizedFields, customFieldsNames, errors } =
            await csvContactsToJSON(parsedRows);
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

            if (
              field?.additionalEmails?.length &&
              field.additionalEmails.length > maxAdditionalEmailsCount
            ) {
              maxAdditionalEmailsCount = field.additionalEmails.length;
            }

            if (
              field?.additionalPhoneNumbers?.length &&
              field.additionalPhoneNumbers.length >
                maxAdditionalPhoneNumbersCount
            ) {
              maxAdditionalPhoneNumbersCount =
                field.additionalPhoneNumbers.length;
            }

            if (
              field?.additionalAddresses?.length &&
              field.additionalAddresses.length > maxAdditionalAddressesCount
            ) {
              maxAdditionalAddressesCount = field.additionalAddresses.length;
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
                maxAdditionalAddressesCount,
                maxAdditionalPhoneNumbersCount,
                maxAdditionalEmailsCount,
                maxNotesCount,
                customFieldsColumns: customFieldsArr,
              },
              CONTACTS_IMPORT_IDENTIFIER,
            );
            await contactsImportFieldsQueue.add(CONTACTS_IMPORT_IDENTIFIER, {
              normalizedFields,
              spoiledCreations,
              completedCreations,
              needChangeCreations,
              meta: { tenantFilter, userId, isRedis, generatedRegex },
              maxCounts: {
                maxAdditionalAddressesCount,
                maxAdditionalPhoneNumbersCount,
                maxAdditionalEmailsCount,
                maxNotesCount,
              },
              config,
              currentSessionId: currentSession?.id,
            });
          }
          outerResolve();
        } catch (err) {
          console.log('catched');
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
      CONTACTS_IMPORT_IDENTIFIER,
    );
  }
};
