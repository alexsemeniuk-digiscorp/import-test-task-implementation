module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/generate-access-token',
      handler: 'ecommerce-detail.generateApiAccessTokenController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ecommerce-integration-status',
      handler: 'ecommerce-detail.checkIntegrationStatusController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/disconnect-ecommerce',
      handler: 'ecommerce-detail.disconnectEcommerceController',
      config: {
        auth: false,
      },
    },
  ],
};
