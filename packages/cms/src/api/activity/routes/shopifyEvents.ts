module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/shopify-events',
      handler: 'activity.shopifyEventsController',
      config: {
        auth: {
          enabled: false,
        },
      },
    },
  ],
};
