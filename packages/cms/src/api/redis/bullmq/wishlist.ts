import { Queue, QueueEvents } from 'bullmq';
import { NOT_DEVELOPEMENT } from './../../../graphql/constants/enviroment';
import { handleLogger } from './../../../graphql/helpers/errors';
import { updateLastSessionState } from './../helpers/utils/updateImportingSession';
import { WISHLIST_IMPORT_IDENTIFIER } from './../helpers/variables/importingVariables';
import { redisConfig } from './../redis';

const wishlistImportFieldsQueue = new Queue(WISHLIST_IMPORT_IDENTIFIER, {
  connection: redisConfig,
});
wishlistImportFieldsQueue.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

const queueEvents = new QueueEvents(WISHLIST_IMPORT_IDENTIFIER, {
  connection: redisConfig,
});

queueEvents.on('error', (err) => {
  handleLogger('info', 'Redis', 'Redis client error', NOT_DEVELOPEMENT);
});

queueEvents.on('completed', async ({ jobId }) => {
  await updateLastSessionState(jobId, 'completed');
  handleLogger(
    'info',
    'Redis::WISHLIST_QUEQUE',
    `Job ${jobId} completed successfully.`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  await updateLastSessionState(jobId, 'error');
  handleLogger(
    'info',
    'Redis::WISHLIST_QUEQUE',
    `Job ${jobId} failed: ${failedReason}`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('progress', ({ jobId, data }) => {
  handleLogger(
    'info',
    'Redis::WISHLIST_QUEQUE',
    `Job ${jobId} progress:`,
    NOT_DEVELOPEMENT,
  );
});
export default wishlistImportFieldsQueue;
