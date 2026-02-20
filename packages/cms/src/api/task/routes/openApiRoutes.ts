module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/new-task',
      handler: 'task.getTaskOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/create-task',
      handler: 'task.createTaskOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-task',
      handler: 'task.getTaskByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
