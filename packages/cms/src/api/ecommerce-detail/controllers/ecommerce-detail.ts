/**
 * ecommerce-detail controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::ecommerce-detail.ecommerce-detail',
  ({ strapi }) => ({
    async generateApiAccessTokenController(ctx) {
      if (!(ctx?.request?.body?.apiKey && ctx?.request?.body?.apiSecret)) {
        ctx.body = {
          status: 500,
          message: 'Invalid Request',
        };
        return;
      }

      try {
        const response = await strapi.db
          .query(
            'api::ecommerce-custom-app-service.ecommerce-custom-app-service',
          )
          .findOne({
            where: {
              apiKey: ctx?.request?.body?.apiKey,
              apiSecret: ctx?.request?.body?.apiSecret,
            },
            populate: ['tenant'],
          });

        if (!response) {
          ctx.body = {
            status: 500,
            message: 'Invalid Credentials',
          };
          return;
        }

        const users = await strapi
          .query('plugin::users-permissions.user')
          .findMany({
            where: { tenant: response?.tenant?.id },
            populate: ['role'],
          });

        const owner = users?.filter((user) => user.role.name === 'Owner');

        const token = await strapi.plugins[
          'users-permissions'
        ].services.jwt.issue(
          {
            id: owner[0]?.id,
          },
          {
            expiresIn: 315569260,
          },
        );

        ctx.body = {
          status: 200,
          token: token,
          message: 'Success',
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async checkIntegrationStatusController(ctx) {
      if (
        !(ctx?.request?.body?.ecommerceType && ctx?.request?.body?.storeUrl)
      ) {
        return;
      }
      const request = ctx?.request?.body;

      try {
        const ecommerceDetails = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              ecommerceType: request?.ecommerceType,
              storeUrl: request?.storeUrl?.replace(/\/$/, ''),
            },
          });

        if (ecommerceDetails?.status) {
          ctx.body = {
            status: 200,
            connectionStatus: true,
            message: 'Ecommerce is Connected!',
          };
        } else {
          ctx.body = {
            status: 200,
            connectionStatus: false,
            message: 'Ecommerce is not Connected!',
          };
        }
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async disconnectEcommerceController(ctx) {
      if (
        !(ctx?.request?.body?.ecommerceType && ctx?.request?.body?.storeUrl)
      ) {
        return;
      }
      const request = ctx?.request?.body;

      try {
        const ecommerceDetails = await strapi.db
          .query('api::ecommerce-detail.ecommerce-detail')
          .findOne({
            where: {
              ecommerceType: request?.ecommerceType,
              storeUrl: request?.storeUrl?.replace(/\/$/, ''),
            },
          });

        if (ecommerceDetails?.status) {
          await strapi.db
            .query('api::ecommerce-detail.ecommerce-detail')
            .delete({
              where: {
                ecommerceType: request?.ecommerceType,
                storeUrl: request?.storeUrl?.replace(/\/$/, ''),
              },
            });

          ctx.body = {
            status: 200,
            connectionStatus: false,
            message: 'Ecommerce disconnected successfully!',
          };
        } else {
          ctx.body = {
            status: 200,
            connectionStatus: false,
            message: 'Ecommerce is not Connected!',
          };
        }
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
  }),
);
