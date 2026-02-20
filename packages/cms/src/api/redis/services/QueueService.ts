import {
  FlowProducer,
  Job,
  JobsOptions,
  Queue,
  QueueEvents,
  Worker,
  WorkerOptions,
} from 'bullmq';
import { handleLogger } from '../../../graphql/helpers/errors';
import { redisConfig } from '../redis';

interface ExtendedWorkerOptions extends WorkerOptions {
  logCompleted?: boolean;
  logProgress?: boolean;
}

type ProcessorMap<T extends Record<string, any>, R> = {
  [K in keyof T]: (job: Job<T[K]>) => Promise<R>;
};

export class QueueService<T extends Record<string, any> = any, R = any> {
  private queue: Queue<any, R>;
  private worker?: Worker<any, R>;
  private events: QueueEvents;
  private flowProducer: FlowProducer;
  logCompleted: boolean;

  constructor(
    queueName: string,
    processor?: (job: Job<T>) => Promise<R>,
    options?: Omit<ExtendedWorkerOptions, 'connection'>,
  ) {
    this.queue = new Queue<any, R>(queueName, {
      connection: redisConfig,
    });

    this.flowProducer = new FlowProducer({ connection: redisConfig });

    if (processor) {
      const { logCompleted, logProgress, ...workerOptions } = options || {};
      this.logCompleted = logCompleted;

      this.worker = new Worker<any, R>(
        queueName,
        async (job) => {
          const result = await processor(job);

          if (logProgress) {
            job.updateProgress(100);
          }

          return result;
        },
        {
          connection: redisConfig,
          ...workerOptions,
        },
      );

      this.worker.on('error', (err) => {
        handleLogger(
          'error',
          `[Worker][${queueName}] Error: ${err.message}`,
          '',
        );
      });

      if (logCompleted) {
        this.worker.on('completed', (job) => {
          handleLogger(
            'info',
            `[Worker][${queueName}] Job completed: ${job.id}`,
            '',
          );
        });
      }
    }

    this.events = new QueueEvents(queueName, {
      connection: redisConfig,
    });

    this.events.on('error', (err) => {
      handleLogger(
        'error',
        `[QueueEvents][${queueName}] Error: ${err.message}`,
        '',
      );
    });
    this.events.on('completed', ({ jobId }) => {
      handleLogger(
        'info',
        `[QueueEvents][${queueName}] Job completed: ${jobId}`,
        '',
      );
    });
  }

  getQueue() {
    return this.queue;
  }

  getEvents() {
    return this.events;
  }

  getFlowProducer() {
    return this.flowProducer;
  }

  async addJob<K extends keyof T>(name: K, data: T[K], opts: JobsOptions = {}) {
    return await this.queue.add(name as string, data, {
      removeOnComplete: true,
      ...opts,
    });
  }

  async addFlowJob<K extends keyof T>(
    name: K,
    data: T[K],
    children: any[] = [],
    opts: JobsOptions = {},
  ) {
    return await this.flowProducer.add({
      name: name as string,
      queueName: this.queue.name,
      data,
      children,
      opts: {
        removeOnComplete: true,
        ...opts,
      },
    });
  }
}
