import { QueueEvents, Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { addDollarToFilterKeys } from '../../../helpers/addDollarToFilterKeys';
import { generateMarketingReportData } from '../../contact/helpers/reportExportData/marketingReportExportData/helpers';
import { generateDailySummaryReportData } from '../../order/helpers/reportExportData/dailySummaryReportExportData/helpers';
import { generateSalesOrderReportData } from '../../order/helpers/reportExportData/salesOrderReportExportData/helpers';
import { generateTaxReportData } from '../../order/helpers/reportExportData/taxReportExportData/helpers';
import { generateInventoryItemReportData } from '../../product/helpers/reportExportData/inventoryItemReportExportData/helpers';
import { generateInventoryReportData } from '../../product/helpers/reportExportData/inventoryReportExportData/helpers';
import { generateMemoInReportData } from '../../product/helpers/reportExportData/memoInReportExportData/helpers';
import { generateMemoOutReportData } from '../../product/helpers/reportExportData/memoOutReportExportData/helpers';
import { generateSalesItemReportData } from '../../product/helpers/reportExportData/salesItemReportExportData/helpers';
import reportExportDataQueue from './../../../../api/redis/bullmq/reportExportData';
import { REPORT_EXPORT_DATA_IDENTIFIER } from './../../../../api/redis/helpers/variables/reportExportVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { handleLogger } from './../../../helpers/errors';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

const worker = new Worker(
  REPORT_EXPORT_DATA_IDENTIFIER,
  async (job) => {
    try {
      if (job?.data?.reportName === 'marketing-report') {
        try {
          return await generateMarketingReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Marketing report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'inventory-report') {
        try {
          return await generateInventoryReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Inventory report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'inventory-item-report') {
        try {
          return await generateInventoryItemReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Inventory item report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'memo-in-report') {
        try {
          return await generateMemoInReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Memo in report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'memo-out-report') {
        try {
          return await generateMemoOutReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Memo out report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'daily-summary-report') {
        try {
          return await generateDailySummaryReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Daily summary report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'sales-order-report') {
        try {
          return await generateSalesOrderReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Sales order report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'sales-item-report') {
        try {
          return await generateSalesItemReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Sales item report export data error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'tax-report') {
        try {
          return await generateTaxReportData(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Tax report export data error: ${error}`,
          );
        }
      }
    } catch (error) {
      handleLogger('info', 'Redis', `Report export data error: ${error}`);
    }
  },
  {
    connection: redisConfig,
    concurrency: 1,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Report export data worker error');
});

const normalizedFieldsQueueEvents = new QueueEvents(
  REPORT_EXPORT_DATA_IDENTIFIER,
  {
    connection: redisConfig,
  },
);

export const reportExportData: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: any }
> = async (root, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const reportName = input?.reportName;
  const tenantFilter = await getTenantFilter(userId);
  const reportFilter = addDollarToFilterKeys(input?.additionalFilters);
  const periodFilter = input?.period;

  try {
    const job = await reportExportDataQueue.add(REPORT_EXPORT_DATA_IDENTIFIER, {
      reportName,
      tenantFilter,
      reportFilter,
      periodFilter,
    });

    const result = await job.waitUntilFinished(normalizedFieldsQueueEvents);

    return {
      reportExportDataJSON: JSON.stringify({ result }),
    };
  } catch (e) {
    handleLogger('info', 'Redis', `Report export data query error ${e}`);
  }
};
