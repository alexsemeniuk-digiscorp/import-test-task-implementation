export default {
  routes: [
    {
      method: 'GET',
      path: '/unsubscribe/:token',
      handler: 'unsubscribe.unsubscribe',
      config: {
        auth: false,
      },
    },
  ],
};
