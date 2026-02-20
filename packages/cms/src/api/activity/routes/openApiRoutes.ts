module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/new-activity',
      handler: 'activity.getActivityOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/create-activity',
      handler: 'activity.createActivityOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-activity',
      handler: 'activity.getActivityByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
