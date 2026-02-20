module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-order',
      handler: 'order.createOrderOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'PUT',
      path: '/update-order',
      handler: 'order.updateOrderOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-order',
      handler: 'order.getOrderOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-order',
      handler: 'order.getOrderByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
