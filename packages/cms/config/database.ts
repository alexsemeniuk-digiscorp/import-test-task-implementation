import { Knex } from 'knex';

import app, { workdirResolve } from '../src/hooks';

export default ({ env }: Strapi.Env): Knex.Config => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const mode = env('CURRENT_ENV');

  const maxPool = mode === 'caratiqapp' ? 1000 : mode === 'caratiq' ? 100 : 10;

  const pool = {
    min: env.int('DATABASE_POOL_MIN', 2),
    max: env.int('DATABASE_POOL_MAX', maxPool),
  };

  const config: Knex.Config =
    client === 'sqlite'
      ? {
          connection: {
            filename: workdirResolve(
              ...(env<string>('DATABASE_FILENAME') ?? [
                'database',
                `${env('NODE_ENV')}.sqlite`,
              ]),
            ),
          },
          jsonbSupport: true,
          useNullAsDefault: true,
        }
      : {
          connection: {
            ssl: env.bool('DATABASE_SSL', false),
            ...(env('DATABASE_URL', '')
              ? { connectionString: env('DATABASE_URL') }
              : {
                  user: env('DATABASE_USERNAME', 'postgres'),
                  password: env('DATABASE_PASSWORD', 'password'),
                  database: env('DATABASE_NAME', env('APP_NAME', app.name)),
                  host: env('DATABASE_HOST', 'database'),
                  port: env.int('DATABASE_PORT', 5432),
                }),
          },
          pool,
        };

  return { connection: { client, ...(mode === 'test' ? {} : config) } };
};
