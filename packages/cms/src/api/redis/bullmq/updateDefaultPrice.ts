import { Queue, QueueEvents } from 'bullmq';
import { NOT_DEVELOPEMENT } from './../../../graphql/constants/enviroment';
import { handleLogger } from './../../../graphql/helpers/errors';
import { updateLastSessionState } from './../helpers/utils/updateImportingSession';
import { UPDATE_DEFAULT_PRICE_IDENTIFIER } from './../helpers/variables/importingVariables';
import { redisConfig } from './../redis';

const updateDefaultPriceQueue = new Queue(UPDATE_DEFAULT_PRICE_IDENTIFIER, {
  connection: redisConfig,
});
updateDefaultPriceQueue.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

const queueEvents = new QueueEvents(UPDATE_DEFAULT_PRICE_IDENTIFIER, {
  connection: redisConfig,
});

queueEvents.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

queueEvents.on('completed', async ({ jobId }) => {
  await updateLastSessionState(jobId, 'completed');
  handleLogger(
    'info',
    'Redis::UPDATE_DEFAULT_PRICE_QUEQUE',
    `Job ${jobId} completed successfully.`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  await updateLastSessionState(jobId, 'error');
  handleLogger(
    'info',
    'Redis::UPDATE_DEFAULT_PRICE_QUEQUE',
    `Job ${jobId} failed: ${failedReason}`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('progress', ({ jobId, data }) => {
  handleLogger(
    'info',
    'Redis::UPDATE_DEFAULT_PRICE_QUEQUE',
    `Job ${jobId} progress:`,
    NOT_DEVELOPEMENT,
  );
});
export default updateDefaultPriceQueue;
