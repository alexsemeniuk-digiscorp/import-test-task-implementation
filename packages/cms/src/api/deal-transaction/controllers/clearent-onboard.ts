import { factories } from '@strapi/strapi';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';

export default factories.createCoreController(
  'api::deal-transaction.deal-transaction',
  ({ strapi }) => ({
    async clearentWebhookOnboardController(ctx) {
      try {
        const event = ctx.request.body;

        // Handle the event based on the event type
        if (event.event === 'Boarded') {
          const { merchantId, orderId, payload } = event;
          const terminal = payload.terminals && payload.terminals[0];

          // Ensure terminal data exists
          if (!terminal) {
            return ctx.badRequest(
              'No terminal data found in the event payload',
            );
          }
          const hppKey = encryptionService({ strapi }).encrypt(
            terminal?.apiKey,
          );

          // Update the deal transaction with the new details
          await strapi.query('api::deal-transaction.deal-transaction').update({
            where: { id: orderId },
            data: {
              merchantId: merchantId,
              terminalId: terminal?.terminalId,
              hppKey: hppKey,
            },
          });
        }

        ctx.body = {
          status: 200,
          message: 'Success',
          event,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error.message,
          message: 'Internal server error',
        };
      }
    },
  }),
);
