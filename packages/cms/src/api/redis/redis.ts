import Redis from 'ioredis';
import { NOT_DEVELOPEMENT } from './../../graphql/constants/enviroment';
import { handleLogger } from './../../graphql/helpers/errors';

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    const maxRetries = 2;
    const delay = Math.min(times * 50, 2000);

    if (times >= maxRetries) {
      return null;
    }

    return delay;
  },
};

const redis = new Redis(redisConfig);

redis.on('error', (err) => {
  handleLogger('info', 'Redis', `Redis client error`, NOT_DEVELOPEMENT);
});

redis.on('connect', () => {
  handleLogger('info', 'Redis', 'Redis client connected', NOT_DEVELOPEMENT);
});

redis.on('end', () => {
  handleLogger('info', 'Redis', 'Redis client disconnected', NOT_DEVELOPEMENT);
});

export default redis;
