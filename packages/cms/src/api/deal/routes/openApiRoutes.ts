module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/new-deal',
      handler: 'deal.getDealOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/create-deal',
      handler: 'deal.createDealOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-deal',
      handler: 'deal.getDealByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
