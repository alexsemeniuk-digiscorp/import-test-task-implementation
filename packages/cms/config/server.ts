import { randomSecret } from '../src/hooks';
import tasks from './functions/cron';

export default ({ env }: Strapi.Env) => {
  const host = env('HOST', '127.0.0.1');
  const port = env('PORT', '1337');

  return {
    host,
    port,
    url: env('ABSOLUTE_URL', `http://${host}:${port}`),
    proxy: true,
    cron: {
      enabled: true,
      tasks,
    },
    app: {
      keys: env.array<string>('APP_KEYS', [randomSecret('APP_KEYS')]),
    },
    env: {
      frontendUrl: env('FRONTEND_URL', `http://${host}:${8080}`),
    },
  };
};
