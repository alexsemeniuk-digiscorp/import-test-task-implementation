import { LifecycleHook } from '../types';

export const deleteConversation: LifecycleHook = async ({ params }) => {
  const conversation = await strapi.entityService.findOne(
    'api::conversation.conversation',
    params.where.id,
    {
      fields: ['id', 'type', 'threadId', 'conversationSid'],
      populate: {
        twilioConnection: {
          fields: ['id', 'accountSid'],
        },
        user: {
          fields: ['id'],
          populate: {
            nylasConnection: {
              fields: ['id', 'grantId'],
            },
          },
        },
      },
    },
  );

  if (conversation.type === 'mail') {
    const nylasService = await strapi.service(
      'api::nylas-connection.nylas-connection',
    );

    await nylasService.deleteThread(
      conversation.threadId,
      conversation.user.nylasConnection.grantId,
    );
  }

  if (conversation.type === 'sms') {
    const twilioService = await strapi.service(
      'api::twilio-connection.twilio-connection',
    );

    if (conversation.conversationSid) {
      await twilioService.deleteConversation(
        conversation.twilioConnection.accountSid,
        conversation.conversationSid,
      );
    }
  }
};
