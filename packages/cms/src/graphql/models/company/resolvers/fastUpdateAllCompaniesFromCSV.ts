import { Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from './../../../../../src/types/generated/graphql';
import {
  COMPANIES_IMPORT_IDENTIFIER,
  FAST_UPDATE_COMPANY_IDENTIFIER,
  updatingImportingData,
} from './../../../../api/redis/helpers/variables/importingVariables';
import redis, { redisConfig } from './../../../../api/redis/redis';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

import fastUpdateCompanyQueue from './../../../../../src/api/redis/bullmq/fastUpdateCompany';
import { handleLogger } from './../../../../../src/graphql/helpers/errors';
import { NOT_DEVELOPEMENT } from './../../../../graphql/constants/enviroment';
import { singleCompanyUpdating } from './helpers/helpers';

const worker = new Worker(
  FAST_UPDATE_COMPANY_IDENTIFIER,
  async (job) => {
    const {
      updatableContacts,
      meta: { tenantFilter, lastSessionId },
    } = job.data;

    try {
      if (updatableContacts && updatableContacts?.length) {
        for (let i = 0; i < updatableContacts?.length; i++) {
          const updatableContact = updatableContacts?.[i];
          if (updatableContact) {
            await singleCompanyUpdating(updatableContact, {
              tenantFilter,
              regexedSessionId: lastSessionId,
            });
          }
        }
      }
    } catch (e) {
      handleLogger(
        'error',
        'fastUpdateAllContactsFromCSV',
        'Fast Update Error',
        NOT_DEVELOPEMENT,
      );
    }
  },
  {
    connection: redisConfig,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Product worker error');
});

export const fastUpdateAllCompaniesFromCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['FastUpdateAllContactsFromCSVInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx.state.user.id;
  const tenantFilter = await getTenantFilter(userId);

  const lastSession = await strapi.entityService.findMany(
    'api::importing-session.importing-session',
    {
      filters: {
        type: COMPANIES_IMPORT_IDENTIFIER,
        ...tenantFilter,
      },
      limit: 1,
      sort: ['createdAt:desc'],
      fields: ['regexedId'],
    },
  );

  const deleteKey = updatingImportingData(
    lastSession?.[0]?.regexedId,
    tenantFilter?.tenant,
    COMPANIES_IMPORT_IDENTIFIER,
  );
  const parsedRange = await redis.lrange(deleteKey, 0, -1);

  const parsedContacts = await Promise.all(
    parsedRange.map(async (item) => {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error('JSON parsing error:', e, 'for item:', item);
        return null;
      }
    }),
  ).then((results) => results.filter(Boolean));

  const bothDifferentArr = parsedContacts?.filter(
    (contact) => contact?.updatingType === 'bothDifferent',
  );
  const updatableContacts = parsedContacts?.filter(
    (contact) => contact?.updatingType !== 'bothDifferent',
  );

  await fastUpdateCompanyQueue.add(FAST_UPDATE_COMPANY_IDENTIFIER, {
    updatableContacts,
    meta: { tenantFilter, lastSessionId: lastSession?.[0]?.regexedId },
  });

  return JSON.stringify({ bothDifferentArr });
};
