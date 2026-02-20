import { NOT_DEVELOPEMENT } from './../../../../graphql/constants/enviroment';
import { handleLogger } from './../../../../graphql/helpers/errors';
import redis from './../../redis';

export const checkRedisConnection = async () => {
  try {
    await redis.ping();
    handleLogger('info', 'Redis', 'Redis is connected.', NOT_DEVELOPEMENT);
    return true;
  } catch (err) {
    handleLogger('info', 'Redis', 'Redis connection error', NOT_DEVELOPEMENT);
    return false;
  }
};
