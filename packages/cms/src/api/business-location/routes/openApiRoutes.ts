module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/new-store',
      handler: 'business-location.getBusinessLocationsOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-store',
      handler: 'business-location.getBusinessLocationByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
