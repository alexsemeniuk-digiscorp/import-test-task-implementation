export default {
  routes: [
    {
      method: 'POST',
      path: '/web-chat',
      handler: 'chat-notification.webChat',
      config: {
        auth: false,
      },
    },
  ],
};
