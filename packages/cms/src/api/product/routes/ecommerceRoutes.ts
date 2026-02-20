module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/update-shop-product',
      handler: 'product.shopifyProductWebhookController',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/update-woo-product',
      handler: 'product.woocommerceProductWebhookController',
      config: {
        auth: false,
      },
    },
  ],
};
