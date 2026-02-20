export default {
  async expire(ctx) {
    try {
      if (ctx.request.body.type === 'grant.expired') {
        console.log(ctx.request.body.data.object.grant_id);
        const nylasConnection = await strapi.entityService.findMany(
          'api::nylas-connection.nylas-connection',
          {
            filters: {
              grantId: ctx.request.body.data.object.grant_id,
            },
            populate: ['user'],
          },
        );

        if (nylasConnection.length > 0) {
          await strapi.entityService.update(
            'api::nylas-connection.nylas-connection',
            nylasConnection[0].id,
            {
              data: {
                status: 'expired',
              },
            },
          );

          const service = await strapi.service(
            'api::nylas-connection.nylas-connection',
          );
          await service.deleteGrant(ctx.request.body.data.object.grant_id);

          const notificationService = await strapi.service(
            'api::user-notification.user-notification',
          );

          const nylasNotification = await strapi.entityService.create(
            'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire',
            {
              data: {},
            },
          );

          await notificationService.createUserNotification(
            nylasConnection[0].user.id,
            'NylasGrantExpire',
            {
              nylasNotification: nylasNotification.id,
            },
          );
        }
      }

      if (ctx.request.body.type === 'grant.deleted') {
        console.log(ctx.request.body.data.object.grant_id);
        const nylasConnection = await strapi.entityService.findMany(
          'api::nylas-connection.nylas-connection',
          {
            filters: {
              grantId: ctx.request.body.data.object.grant_id,
            },
            populate: ['user'],
          },
        );

        if (nylasConnection.length > 0) {
          await strapi.entityService.update(
            'api::nylas-connection.nylas-connection',
            nylasConnection[0].id,
            {
              data: {
                status: 'expired',
              },
            },
          );

          const notificationService = await strapi.service(
            'api::user-notification.user-notification',
          );

          const nylasNotification = await strapi.entityService.create(
            'api::notifications-nylas-grant-expire.notifications-nylas-grant-expire',
            {
              data: {},
            },
          );

          await notificationService.createUserNotification(
            nylasConnection[0].user.id,
            'NylasGrantExpire',
            {
              nylasNotification: nylasNotification.id,
            },
          );
        }
      }
    } catch (error) {
      strapi.log.error('An error occurred while grant expire:', error);
      return ctx.send(
        'An error occurred with grant expire. Please try again later.',
        500,
      );
    }
  },
  async challenge(ctx) {
    if (ctx.query.challenge) {
      ctx.response.status = 200;
      ctx.response.body = ctx.query.challenge;
    }
  },
};
