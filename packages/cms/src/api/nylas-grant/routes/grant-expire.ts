export default {
  routes: [
    {
      method: 'POST',
      path: '/grant-expire',
      handler: 'grant-expire.expire',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/grant-expire',
      handler: 'grant-expire.challenge',
      config: {
        auth: false,
      },
    },
  ],
};
