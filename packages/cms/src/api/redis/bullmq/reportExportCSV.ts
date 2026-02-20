import { Queue, QueueEvents } from 'bullmq';
import { NOT_DEVELOPEMENT } from './../../../graphql/constants/enviroment';
import { handleLogger } from './../../../graphql/helpers/errors';
import { updateLastSessionState } from './../helpers/utils/updateImportingSession';
import { REPORT_EXPORT_CSV_IDENTIFIER } from './../helpers/variables/reportExportVariables';
import { redisConfig } from './../redis';

const reportExportCSVQueue = new Queue(REPORT_EXPORT_CSV_IDENTIFIER, {
  connection: redisConfig,
});
reportExportCSVQueue.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

const queueEvents = new QueueEvents(REPORT_EXPORT_CSV_IDENTIFIER, {
  connection: redisConfig,
});

queueEvents.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

queueEvents.on('completed', async ({ jobId }) => {
  await updateLastSessionState(jobId, 'completed');
  handleLogger(
    'info',
    'Redis::REPORT_CSV_QUEUE',
    `Job ${jobId} completed successfully.`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  await updateLastSessionState(jobId, 'error');
  handleLogger(
    'info',
    'Redis::REPORT_CSV_QUEUE',
    `Job ${jobId} failed: ${failedReason}`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('progress', ({ jobId, data }) => {
  handleLogger(
    'info',
    'Redis::REPORT_CSV_QUEUE',
    `Job ${jobId} progress:`,
    NOT_DEVELOPEMENT,
  );
});
export default reportExportCSVQueue;
