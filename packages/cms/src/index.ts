// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dd-trace').init();

import { GraphQLResolveInfo } from 'graphql';
import { deleteExceededServiceUser } from './api/lifecyclesHelpers/hr/deleteExceededServiceUser';
import { deletePayRate } from './api/lifecyclesHelpers/hr/deletePayRate';
import { blockUserUpdateServiceUsage } from './api/lifecyclesHelpers/user/blockUserUpdateServiceUsage';
import { SocketIo } from './api/socket/SocketIo';
import { extendSchema } from './graphql';
import { updateUsageCounts } from './graphql/models/usage/resolvers/updateUsageCounts';
import app, { generateTypeDefinitions } from './hooks';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export default {
  register({ strapi }: StrapiGlobal): void {
    strapi.config.set('app', app);
    strapi.config.set('middleware.settings.session', 'grant');
    extendSchema(strapi);
  },

  bootstrap({ strapi }: StrapiGlobal): void {
    strapi.log.info(
      `[app] Production domain: ${strapi.config.get('app.domain')}`,
    );

    try {
      const client = strapi.db?.connection?.client;
      const poolConfig =
        (client && client.config && client.config.pool) ||
        (client && client.pool && client.pool.options) ||
        null;

      strapi.log.info(
        `[app] Database pool config: ${
          poolConfig ? JSON.stringify(poolConfig) : 'not found'
        }`,
      );
    } catch (err) {
      strapi.log.error('Failed to log DB pool config', err);
    }

    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],

      async afterCreate(event: any) {
        const file = event.params?.data;

        try {
          const ctx = strapi.requestContext.get();

          const userId = ctx?.state?.user?.id;

          if (!userId) {
            strapi.log.warn(
              'User ID not found in context(maybe was calculated in other way)',
            );
            return;
          }

          try {
            const user = await strapi.entityService.findOne(
              'plugin::users-permissions.user',
              userId,
              {
                fields: ['id'],
                populate: {
                  tenant: {
                    fields: ['id', 'storageUsage'],
                  },
                },
              },
            );

            if (user) {
              if (user?.tenant?.id) {
                const tenant = user?.tenant;

                const currentUsage = tenant.storageUsage
                  ? parseFloat(tenant.storageUsage)
                  : 0;
                const fileSize = file.size || 0;
                const newUsage = (currentUsage + fileSize).toFixed(2);

                await strapi.entityService.update(
                  'api::tenant.tenant',
                  tenant.id,
                  {
                    data: {
                      storageUsage: newUsage,
                    },
                  },
                );

                const info: GraphQLResolveInfo = ctx.state
                  .graphqlInfo as GraphQLResolveInfo;

                // Attempt to update usage counts
                const updateUsage = await updateUsageCounts(
                  null,
                  {
                    input: {
                      serviceType: 'storage',
                      serviceCharge: 'storageCharge',
                      newStorageUsage: fileSize,
                    },
                  },
                  ctx,
                  info,
                );

                if (!updateUsage) {
                  throw new Error('Usage update failed');
                }

                strapi.log.info(
                  `Updated tenant ${tenant.id} storage usage with context params: ${currentUsage}KB -> ${newUsage}KB (+${fileSize}KB)`,
                );
              }
            }
          } catch (err) {
            strapi.log.error('Failed to fetch file with related entities', err);
          }
        } catch (err) {
          strapi.log.error('Failed to track file storage usage', err);
        }
      },
    });
    strapi.log.info(
      `[app] Application: ${strapi.config.get(
        'app.name',
      )}, version: ${strapi.config.get('app.version')}`,
    );
    strapi.log.info(
      `[app] Database Engine: ${strapi.config.get(
        'database.connection.client',
      )}`,
    );
    strapi.config.get('app.env.development') && generateTypeDefinitions(strapi);

    SocketIo.init();

    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeDelete(e: BeforeLifecycleEvent) {
        await deletePayRate(e);
        await deleteExceededServiceUser(e);
      },
      async afterUpdate(e: AfterLifecycleEvent) {
        await blockUserUpdateServiceUsage(e);
      },
    });
  },
};
