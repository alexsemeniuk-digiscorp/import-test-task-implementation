import { Queue, QueueEvents } from 'bullmq';
import { NOT_DEVELOPEMENT } from '../../../graphql/constants/enviroment';
import { handleLogger } from '../../../graphql/helpers/errors';
import { redisConfig } from '../redis';

export const LIDO_AI_EXTRACTION_QUEUE = 'lido-ai-extraction';

// Create queue
export const lidoAiExtractionQueue = new Queue(LIDO_AI_EXTRACTION_QUEUE, {
  connection: redisConfig,
});

lidoAiExtractionQueue.on('error', (err) => {
  handleLogger(
    'error',
    'Redis::LIDO_AI',
    `Queue error: ${err.message}`,
    NOT_DEVELOPEMENT,
  );
});

// Create queue events for status tracking
const queueEvents = new QueueEvents(LIDO_AI_EXTRACTION_QUEUE, {
  connection: redisConfig,
});

queueEvents.on('error', (err) => {
  handleLogger(
    'error',
    'Redis::LIDO_AI',
    `QueueEvents error: ${err.message}`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('completed', ({ jobId }) => {
  handleLogger(
    'info',
    'Redis::LIDO_AI',
    `Job ${jobId} completed successfully.`,
    NOT_DEVELOPEMENT,
  );
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  handleLogger(
    'error',
    'Redis::LIDO_AI',
    `Job ${jobId} failed: ${failedReason}`,
    NOT_DEVELOPEMENT,
  );
});

export { queueEvents as lidoAiQueueEvents };
