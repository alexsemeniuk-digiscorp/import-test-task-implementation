module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/confirm-transaction',
      handler: 'deal-transaction.clearentWebhookTransactionController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/clearent-onboard',
      handler: 'clearent-onboard.clearentWebhookOnboardController',
      config: {
        auth: false,
      },
    },
  ],
};
