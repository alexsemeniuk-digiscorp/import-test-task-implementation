module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-shop-contact',
      handler: 'contact.shopifyContactWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/create-woo-contact',
      handler: 'contact.woocommerceContactWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/create-magento-contact',
      handler: 'contact.magentoContactWebhookController',
      config: {
        auth: false,
      },
    },
  ],
};
