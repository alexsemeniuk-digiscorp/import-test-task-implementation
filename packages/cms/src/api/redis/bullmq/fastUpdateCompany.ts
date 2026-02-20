import { Queue, QueueEvents } from 'bullmq';
import { NOT_DEVELOPEMENT } from './../../../graphql/constants/enviroment';
import { handleLogger } from './../../../graphql/helpers/errors';
import { updateLastSessionState } from './../helpers/utils/updateImportingSession';
import { FAST_UPDATE_COMPANY_IDENTIFIER } from './../helpers/variables/importingVariables';
import { redisConfig } from './../redis';

const fastUpdateCompanyQueue = new Queue(FAST_UPDATE_COMPANY_IDENTIFIER, {
  connection: redisConfig,
});
fastUpdateCompanyQueue.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

const queueEvents = new QueueEvents(FAST_UPDATE_COMPANY_IDENTIFIER, {
  connection: redisConfig,
});

queueEvents.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

queueEvents.on('completed', async ({ jobId }) => {
  await updateLastSessionState(jobId, 'completed');
  handleLogger(
    'info',
    'Redis::CONTACTS_QUEQUE',
    `Job ${jobId} completed successfully.`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  await updateLastSessionState(jobId, 'error');
  handleLogger(
    'info',
    'Redis::CONTACTS_QUEQUE',
    `Job ${jobId} failed: ${failedReason}`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('progress', ({ jobId }) => {
  handleLogger(
    'info',
    'Redis::CONTACTS_QUEQUE',
    `Job ${jobId} progress:`,
    NOT_DEVELOPEMENT,
  );
});
export default fastUpdateCompanyQueue;
