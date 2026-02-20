import { QueueEvents, Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { addDollarToFilterKeys } from '../../../helpers/addDollarToFilterKeys';
import { generateSalesByItemCategoryReportData } from '../../order/helpers/salesByItemCategoryReport/helpers';
import salesByItemCategoryReportQueue from './../../../../api/redis/bullmq/salesByItemCategoryReport';
import { SALES_BY_ITEM_CATEGORY_REPORT_IDENTIFIER } from './../../../../api/redis/helpers/variables/reportExportVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { handleLogger } from './../../../helpers/errors';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

const worker = new Worker(
  SALES_BY_ITEM_CATEGORY_REPORT_IDENTIFIER,
  async (job) => {
    try {
      return await generateSalesByItemCategoryReportData(job);
    } catch (error) {
      handleLogger(
        'info',
        'Redis',
        `Sales by item category report error: ${error}`,
      );
    }
  },
  {
    connection: redisConfig,
    concurrency: 1,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Sales by item category report worker error');
});

const normalizedFieldsQueueEvents = new QueueEvents(
  SALES_BY_ITEM_CATEGORY_REPORT_IDENTIFIER,
  {
    connection: redisConfig,
  },
);

export const salesByItemCategoryReport: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: any }
> = async (root, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const tenantFilter = await getTenantFilter(userId);
  const queryType = input?.queryType;
  const chartType = input?.chartType;
  const targetYear = input?.targetYear;
  const parentId = input?.parentId;
  const startElem = input?.startElem;
  const reportFilter = addDollarToFilterKeys(input?.additionalFilters);

  try {
    const job = await salesByItemCategoryReportQueue.add(
      SALES_BY_ITEM_CATEGORY_REPORT_IDENTIFIER,
      {
        tenantFilter,
        reportFilter,
        queryType,
        chartType,
        targetYear,
        parentId,
        startElem,
      },
    );

    return await job.waitUntilFinished(normalizedFieldsQueueEvents);
  } catch (e) {
    handleLogger(
      'info',
      'Redis',
      `Sales by item category report query error ${e}`,
    );
  }
};
