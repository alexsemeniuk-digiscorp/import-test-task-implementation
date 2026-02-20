module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-task-webhook',
      handler: 'zapier-webhook.createTaskWebhookOpenApiController',
      config: {
        auth: {
          auth: false, // Set to true if you want authentication
          policies: [],
          middlewares: [],
        },
      },
    },
    {
      method: 'DELETE',
      path: '/delete-task-webhook',
      handler: 'zapier-webhook.deleteTaskWebhookOpenApiController',
      config: {
        auth: {
          auth: false, // Set to true if you want authentication
          policies: [],
          middlewares: [],
        },
      },
    },
    {
      method: 'POST',
      path: '/create-order-webhook',
      handler: 'zapier-webhook.createOrderWebhookOpenApiController',
      config: {
        auth: {
          auth: false, // Set to true if you want authentication
          policies: [],
          middlewares: [],
        },
      },
    },
    {
      method: 'DELETE',
      path: '/delete-order-webhook',
      handler: 'zapier-webhook.deleteOrderWebhookOpenApiController',
      config: {
        auth: {
          auth: false, // Set to true if you want authentication
          policies: [],
          middlewares: [],
        },
      },
    },
  ],
};
