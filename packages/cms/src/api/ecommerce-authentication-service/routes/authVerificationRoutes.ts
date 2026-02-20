module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/verify-auth-code',
      handler:
        'ecommerce-authentication-service.ecommerceAuthCodeVerifyWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/verify-woo-token',
      handler:
        'ecommerce-authentication-service.woocommerceTokenVerifyWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/verify-magento-token',
      handler:
        'ecommerce-authentication-service.magentoTokenVerifyWebhookController',
      config: {
        auth: false,
      },
    },
  ],
};
