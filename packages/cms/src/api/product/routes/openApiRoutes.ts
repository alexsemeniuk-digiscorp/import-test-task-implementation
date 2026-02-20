module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-product',
      handler: 'product.createProductOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-product',
      handler: 'product.getProductsOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-product',
      handler: 'product.getProductByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
