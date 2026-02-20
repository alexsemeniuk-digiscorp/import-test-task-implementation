module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/stripe-webhook',
      handler: 'order.stripeWebhookController',
      config: {
        auth: false,
      },
    },
  ],
};
