/**
 * zapier-webhook controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::zapier-webhook.zapier-webhook',
  ({ strapi }) => ({
    async createTaskWebhookOpenApiController(ctx) {
      try {
        const { target_url } = ctx.request.body;
        console.log(ctx?.request, 'webhook create task controller');
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);
        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });
        const zapierWebhook = await strapi
          .service('api::zapier-webhook.zapier-webhook')
          .create({
            data: {
              webhook: target_url,
              type: 'task',
              tenant: owner?.tenant?.id,
            },
          });
        return {
          status: 200,
          message: 'Webhook created successfully',
          data: zapierWebhook,
        };
      } catch (error) {
        console.log(error, 'webhook error ');
        return {
          status: 500,
          message: 'Failed to create webhook',
          error: error.message,
        };
      }
    },
    async createOrderWebhookOpenApiController(ctx) {
      try {
        const { target_url } = ctx.request.body;
        console.log(ctx?.request, 'webhook create order controller');
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);
        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });
        const zapierWebhook = await strapi.entityService.create(
          'api::zapier-webhook.zapier-webhook',
          {
            data: {
              webhook: target_url,
              type: 'order',
              tenant: owner?.tenant?.id,
            },
          },
        );
        return {
          status: 200,
          message: 'Webhook created successfully',
          data: zapierWebhook,
        };
      } catch (error) {
        return {
          status: 500,
          message: 'Failed to create webhook',
          error: error.message,
        };
      }
    },
    async deleteTaskWebhookOpenApiController(ctx) {
      try {
        const { id } = ctx.params;
        console.log(ctx?.request, 'webhook delete task controller');
        // Get user and tenant for security verification
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);

        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });

        // Verify webhook exists and belongs to the tenant
        const webhook = await strapi.entityService.findOne(
          'api::zapier-webhook.zapier-webhook',
          id,
          {
            filters: {
              type: 'task',
              tenant: { id: { $eq: owner?.tenant?.id } },
            },
          },
        );

        if (!webhook) {
          return ctx.notFound(
            'Webhook not found or does not belong to your tenant',
          );
        }

        // Delete the webhook (unsubscribe)
        await strapi.entityService.delete(
          'api::zapier-webhook.zapier-webhook',
          id,
        );

        return {
          status: 200,
          message: 'Webhook unsubscribed successfully',
        };
      } catch (error) {
        return {
          status: 500,
          message: 'Failed to unsubscribe webhook',
          error: error.message,
        };
      }
    },
    async deleteOrderWebhookOpenApiController(ctx) {
      try {
        const { id } = ctx.params;
        console.log(ctx?.request, 'webhook delete order controller');
        // Get user and tenant for security verification
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);

        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { id: user?.id },
            populate: ['tenant'],
          });

        // Verify webhook exists and belongs to the tenant
        const webhook = await strapi.entityService.findOne(
          'api::zapier-webhook.zapier-webhook',
          id,
          {
            filters: {
              type: 'order',
              tenant: { id: { $eq: owner?.tenant?.id } },
            },
          },
        );

        if (!webhook) {
          return {
            status: 404,
            message: 'Webhook not found or does not belong to your tenant',
          };
        }

        // Delete the webhook (unsubscribe)
        await strapi.entityService.delete(
          'api::zapier-webhook.zapier-webhook',
          id,
        );

        return {
          status: 200,
          message: 'Webhook unsubscribed successfully',
        };
      } catch (error) {
        console.log(error, 'webhook delete order error');
        return {
          status: 500,
          message: 'Failed to unsubscribe webhook',
          error: error.message,
        };
      }
    },
  }),
);
