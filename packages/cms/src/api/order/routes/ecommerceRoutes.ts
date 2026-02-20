module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-shop-order',
      handler: 'order.shopifyOrderWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/create-woo-order',
      handler: 'order.woocommerceOrderWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/create-magento-order',
      handler: 'order.magentoOrderWebhookController',
      config: {
        auth: false,
      },
    },
  ],
};
