import { Strapi } from '@strapi/strapi';
import { Context, Next } from 'koa';
import { RateLimit } from 'koa2-ratelimit';

export default (_config: any, {}: { strapi: Strapi }) => {
  return async (ctx: Context, next: Next) => {
    return RateLimit.middleware({
      interval: { min: 1 }, // 1 minute
      max: 400, // limit each IP to 400 requests per minute
      message: 'Too many requests, please try again later.',
      headers: true,
    })(ctx, next);
  };
};
