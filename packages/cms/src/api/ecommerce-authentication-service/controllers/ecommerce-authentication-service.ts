/**
 * ecommerce-authentication-service controller
 */

import { factories } from '@strapi/strapi';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { getEcommerceAuthCode } from '../../../graphql/models/ecommerceConnection/helpers/helpers';
import { woocommerceApi } from '../../helpers/woocommerceApi';

export default factories.createCoreController(
  'api::ecommerce-authentication-service.ecommerce-authentication-service',
  ({ strapi }) => ({
    async ecommerceAuthCodeVerifyWebhookController(ctx) {
      try {
        if (!ctx?.request?.body?.code) {
          ctx.body = {
            status: 500,
            message: 'Invalid format',
          };
          return;
        }

        const authCode = await strapi.db
          .query(
            'api::ecommerce-authentication-service.ecommerce-authentication-service',
          )
          .findOne({
            where: {
              code: ctx?.request?.body?.code,
              expiry: {
                $gt: new Date(),
              },
            },
          });

        if (authCode) {
          await strapi.db
            .query(
              'api::ecommerce-authentication-service.ecommerce-authentication-service',
            )
            .delete({
              where: { code: ctx?.request?.body?.code },
            });

          const token = getEcommerceAuthCode();

          try {
            await strapi.entityService.create(
              'api::ecommerce-authentication-service.ecommerce-authentication-service',
              {
                data: {
                  token: token,
                  expiry: new Date(Date.now() + 30 * 60 * 1000),
                  tenantId: authCode?.tenantId,
                  shopUrl: authCode?.shopUrl,
                },
              },
            );
          } catch (error) {
            throw new Error(error);
          }

          ctx.body = {
            status: 200,
            data: {
              token: token,
            },
            message: 'Success',
          };
        } else {
          ctx.body = {
            status: 500,
            message: 'Invalid code',
          };
          return;
        }
      } catch (error) {
        console.log(error, 'ecommerceAuthCodeVerifyWebhookController');
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async woocommerceTokenVerifyWebhookController(ctx) {
      try {
        if (
          !(
            ctx?.request?.body?.token &&
            ctx?.request?.body?.consumer_key &&
            ctx?.request?.body?.consumer_secret
          )
        ) {
          ctx.body = {
            status: 500,
            message: 'Invalid format',
          };
          return;
        }

        const token = await strapi.db
          .query(
            'api::ecommerce-authentication-service.ecommerce-authentication-service',
          )
          .findOne({
            where: {
              token: ctx?.request?.body?.token,
              expiry: {
                $gt: new Date(),
              },
            },
          });

        if (token) {
          await strapi.db
            .query(
              'api::ecommerce-authentication-service.ecommerce-authentication-service',
            )
            .delete({
              where: { token: token?.token },
            });

          const ecommerceStore = await strapi.db
            .query('api::ecommerce-detail.ecommerce-detail')
            .findOne({
              where: { ecommerceType: 'woocommerce', tenant: token?.tenantId },
            });

          if (ecommerceStore) {
            return null;
          }

          const consumerKey = encryptionService({ strapi }).encrypt(
            ctx?.request?.body?.consumer_key,
          );
          const consumerSecret = encryptionService({ strapi }).encrypt(
            ctx?.request?.body?.consumer_secret,
          );
          const productWillNotSync = ctx?.request?.body?.productWillNotSync
            ? true
            : false;

          try {
            const response = await strapi.entityService.create(
              'api::ecommerce-detail.ecommerce-detail',
              {
                data: {
                  tenant: token?.tenantId,
                  storeUrl: token?.shopUrl,
                  ecommerceType: 'woocommerce',
                  consumerKey: consumerKey,
                  consumerSecret: consumerSecret,
                  productWillNotSync: productWillNotSync,
                },
              },
            );
            const backendUrl = process.env.ABSOLUTE_URL;

            const webhookData = [
              {
                name: 'Order Created Webhook for CaratIQ',
                topic: 'order.created',
                delivery_url: `${backendUrl}/api/create-woo-order`,
              },
              {
                name: 'Customer Created Webhook for CaratIQ',
                topic: 'customer.created',
                delivery_url: `${backendUrl}/api/create-woo-contact`,
              },
              {
                name: 'Product Udpated Webhook for CaratIQ',
                topic: 'product.updated',
                delivery_url: `${backendUrl}/api/update-woo-product`,
              },
            ];

            if (response) {
              const api = woocommerceApi(
                token?.shopUrl,
                consumerKey,
                consumerSecret,
              );

              for (const data of webhookData) {
                try {
                  await api.post('webhooks', data);
                } catch (error) {
                  console.log(error, 'error 123');
                  return new Error(error);
                }
              }
            }
          } catch (error) {
            console.log(error, 'woocommerceTokenVerifyWebhookController');
            throw new Error(error);
          }

          ctx.body = {
            status: 200,
            data: {
              token: token,
            },
            message: 'Success',
          };
        } else {
          ctx.body = {
            status: 500,
            message: 'Invalid token',
          };
          return;
        }
      } catch (error) {
        console.log(error, 'error 123');
        ctx.body = {
          status: 500,
          error: error,
          message: 'Internal server error',
        };
      }
    },
    async magentoTokenVerifyWebhookController(ctx) {
      try {
        if (!(ctx?.request?.body?.token && ctx?.request?.body?.magento_token)) {
          ctx.body = {
            status: 500,
            message: 'Invalid format',
          };
          return;
        }

        const token = await strapi.db
          .query(
            'api::ecommerce-authentication-service.ecommerce-authentication-service',
          )
          .findOne({
            where: {
              token: ctx?.request?.body?.token,
              expiry: {
                $gt: new Date(),
              },
            },
          });

        if (token) {
          await strapi.db
            .query(
              'api::ecommerce-authentication-service.ecommerce-authentication-service',
            )
            .delete({
              where: { token: token?.token },
            });

          const ecommerceStore = await strapi.db
            .query('api::ecommerce-detail.ecommerce-detail')
            .findOne({
              where: { ecommerceType: 'magento', tenant: token?.tenantId },
            });

          if (ecommerceStore) {
            return null;
          }

          const magentoToken = encryptionService({ strapi }).encrypt(
            ctx?.request?.body?.magento_token,
          );

          try {
            await strapi.entityService.create(
              'api::ecommerce-detail.ecommerce-detail',
              {
                data: {
                  tenant: token?.tenantId,
                  storeUrl: token?.shopUrl,
                  ecommerceType: 'magento',
                  accessToken: magentoToken,
                },
              },
            );
          } catch (error) {
            throw new Error(error);
          }

          ctx.body = {
            status: 200,
            data: {
              token: token,
            },
            message: 'Success',
          };
        } else {
          ctx.body = {
            status: 500,
            message: 'Invalid token',
          };
          return;
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
