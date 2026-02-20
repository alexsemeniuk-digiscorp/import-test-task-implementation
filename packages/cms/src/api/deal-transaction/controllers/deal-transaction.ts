import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::deal-transaction.deal-transaction',
  ({ strapi }) => ({
    async clearentWebhookTransactionController(ctx) {
      try {
        const event = ctx.request.body;

        // Handle the event based on the event type
        if (
          event.payload.transaction.result === 'APPROVED' &&
          event.payload.transaction['order-id']
        ) {
          //Update the entity
          const updateDealTransactionData: UpdateDealTransactionData = {
            status: 'Paid',
            clearentInfo: {
              event,
            },
          };
          if (event.payload.transaction.amount) {
            updateDealTransactionData.summary =
              event.payload.transaction.amount;
            updateDealTransactionData.paid = event.payload.transaction.amount;
          }
          await strapi.query('api::deal-transaction.deal-transaction').update({
            where: { id: event.payload.transaction['order-id'] },
            data: updateDealTransactionData,
          });
        }
        ctx.body = {
          status: 200,
          message: 'success',
          event,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          error: error,
          message: 'internal server error',
        };
      }
    },
  }),
);
