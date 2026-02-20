import { SocketIo } from '../../socket/SocketIo';
import { LifecycleHook } from '../types';

export const notificationDelete: LifecycleHook = async ({ params }) => {
  const notification = await strapi.entityService.findOne(
    'api::chat-notification.chat-notification',
    params.where.id,
    {
      fields: ['id'],
      populate: {
        conversation: {
          fields: ['id'],
          populate: {
            user: {
              fields: ['id'],
            },
          },
        },
      },
    },
  );

  await strapi.entityService.update(
    'api::conversation.conversation',
    notification.conversation.id,
    {
      data: {
        notificationsCount: 0,
      },
    },
  );

  SocketIo.emitToUser(
    Number(notification.conversation.user.id),
    'chat-notification:delete',
    {
      notificationId: params.where.id,
    },
  );
};
