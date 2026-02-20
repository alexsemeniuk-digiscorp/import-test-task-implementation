module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-contact',
      handler: 'contact.createContactOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-contact',
      handler: 'contact.getContactsOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/new-single-contact',
      handler: 'contact.getContactByIdOpenApiController',
      config: {
        auth: {
          enabled: true,
        },
      },
    },
  ],
};
