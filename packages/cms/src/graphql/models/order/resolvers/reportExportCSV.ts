import { QueueEvents, Worker } from 'bullmq';
import { GraphQLFieldResolver } from 'graphql';
import { addDollarToFilterKeys } from '../../../helpers/addDollarToFilterKeys';
import { generateMarketingReportCSV } from '../../contact/helpers/reportExportData/marketingReportExportData/helpers';
import { generateDailySummaryReportCSV } from '../../order/helpers/reportExportData/dailySummaryReportExportData/helpers';
import { generateSalesOrderReportCSV } from '../../order/helpers/reportExportData/salesOrderReportExportData/helpers';
import { generateTaxReportCSV } from '../../order/helpers/reportExportData/taxReportExportData/helpers';
import { generateInventoryItemReportCSV } from '../../product/helpers/reportExportData/inventoryItemReportExportData/helpers';
import { generateInventoryReportCSV } from '../../product/helpers/reportExportData/inventoryReportExportData/helpers';
import { generateMemoInReportCSV } from '../../product/helpers/reportExportData/memoInReportExportData/helpers';
import { generateMemoOutReportCSV } from '../../product/helpers/reportExportData/memoOutReportExportData/helpers';
import { generateSalesItemReportCSV } from '../../product/helpers/reportExportData/salesItemReportExportData/helpers';
import reportExportCSVQueue from './../../../../api/redis/bullmq/reportExportCSV';
import { REPORT_EXPORT_CSV_IDENTIFIER } from './../../../../api/redis/helpers/variables/reportExportVariables';
import { redisConfig } from './../../../../api/redis/redis';
import { handleLogger } from './../../../helpers/errors';
import { getTenantFilter } from './../../dealTransaction/helpers/helpers';

const worker = new Worker(
  REPORT_EXPORT_CSV_IDENTIFIER,
  async (job) => {
    try {
      if (job?.data?.reportName === 'marketing-report') {
        try {
          return await generateMarketingReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Marketing report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'inventory-report') {
        try {
          return await generateInventoryReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Inventory report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'inventory-item-report') {
        try {
          return await generateInventoryItemReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Inventory item report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'memo-in-report') {
        try {
          return await generateMemoInReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Memo in report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'memo-out-report') {
        try {
          return await generateMemoOutReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Memo out report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'daily-summary-report') {
        try {
          return await generateDailySummaryReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Daily summary report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'sales-order-report') {
        try {
          return await generateSalesOrderReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Sales order report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'sales-item-report') {
        try {
          return await generateSalesItemReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Sales item report export CSV error: ${error}`,
          );
        }
      }
      if (job?.data?.reportName === 'tax-report') {
        try {
          return await generateTaxReportCSV(job);
        } catch (error) {
          handleLogger(
            'info',
            'Redis',
            `Tax report export CSV error: ${error}`,
          );
        }
      }
    } catch (error) {
      handleLogger('info', 'Redis', `Report export CSV error: ${error}`);
    }
  },
  {
    connection: redisConfig,
    concurrency: 1,
  },
);

worker.on('error', (err) => {
  handleLogger('info', 'Redis', 'Report export CSV worker error');
});

const normalizedFieldsQueueEvents = new QueueEvents(
  REPORT_EXPORT_CSV_IDENTIFIER,
  {
    connection: redisConfig,
  },
);

export const reportExportCSV: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: any }
> = async (root, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const reportName = input?.reportName;
  const tenantFilter = await getTenantFilter(userId);
  const reportFilter = addDollarToFilterKeys(input?.additionalFilters);
  const extraColumns = input?.extraColumns;
  const periodFilter = input?.period;

  try {
    const job = await reportExportCSVQueue.add(REPORT_EXPORT_CSV_IDENTIFIER, {
      userId,
      reportName,
      tenantFilter,
      reportFilter,
      extraColumns,
      periodFilter,
    });

    const result = await job.waitUntilFinished(normalizedFieldsQueueEvents);

    return {
      reportExportCSVString: result,
    };
  } catch (e) {
    handleLogger('info', 'Redis', `Report export CSV query error ${e}`);
  }
};
