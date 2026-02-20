/**
 * chat-notification controller
 */

import { factories } from '@strapi/strapi';
import { handleLogger } from '../../../graphql/helpers/errors';
import { generateUUID } from '../../../utils/randomBytes';
import { SocketIo } from '../../socket/SocketIo';

export default factories.createCoreController(
  'api::chat-notification.chat-notification',
  ({ strapi }) => ({
    async create(ctx) {
      if (ctx.query.challenge) {
        return ctx.send(ctx.query.challenge);
      }

      if (
        ctx.request.body.AccountSid &&
        ctx.request.body.EventType === 'onMessageAdded'
      ) {
        const conversation = await strapi.entityService.findMany(
          'api::conversation.conversation',
          {
            filters: {
              conversationSid: {
                $eq: ctx.request.body.ConversationSid,
              },
            },
            populate: ['chatNotification', 'user', 'tenant'],
          },
        );

        if (conversation.length > 0) {
          const notification = await strapi.entityService.create(
            'api::chat-notification.chat-notification',
            {
              data: {
                conversation: conversation[0].id,
                tenant: conversation[0].tenant.id,
                isActive: true,
              },
            },
          );

          await strapi.entityService.update(
            'api::conversation.conversation',
            conversation[0].id,
            {
              data: {
                notificationsCount:
                  (conversation[0].notificationsCount || 0) + 1,
              },
            },
          );

          SocketIo.emitToUser(
            conversation[0]?.user?.id,
            'chat-notification:create',
            { notification },
          );
          SocketIo.emitToUser(conversation[0].user.id, 'message:added', {
            isAdded: true,
          });
        } else {
          const twilioConnection = await strapi.entityService.findMany(
            'api::twilio-connection.twilio-connection',
            {
              filters: {
                accountSid: {
                  $eq: ctx.request.body.AccountSid,
                },
              },
              populate: ['tenant'],
            },
          );

          const service = await strapi.service(
            'api::chat-notification.chat-notification',
          );
          const newConversation = await service.getNewConversation({
            filter: {
              phoneNumber: {
                $eq: ctx.request.body.Author,
              },
            },
            data: {
              tenant: twilioConnection?.[0]?.tenant.id,
              conversationSid: ctx.request.body.ConversationSid,
              type: 'sms',
              uuid: generateUUID(),
              isAutocreated: true,
              twilioConnection: twilioConnection?.[0]?.id,
            },
            replyAddress: ctx.request.body.Author,
          });

          if (!twilioConnection[0].conversationServiceSid) {
            const twilio = await strapi.service(
              'api::twilio-connection.twilio-connection',
            );

            const token = await twilio.createConversationAccessToken(
              twilioConnection[0].accountSid,
              twilioConnection[0].id,
              twilioConnection?.[0].tenant.slug,
            );

            await strapi.entityService.update(
              'api::twilio-connection.twilio-connection',
              twilioConnection[0].id,
              {
                data: {
                  conversationServiceSid: ctx.request.body.ChatServiceSid,
                  token,
                },
              },
            );
          }

          await strapi.entityService.create(
            'api::chat-notification.chat-notification',
            {
              data: {
                conversation: newConversation.id,
                tenant: twilioConnection?.[0]?.tenant?.id,
                isActive: true,
              },
            },
          );

          await strapi.entityService.update(
            'api::conversation.conversation',
            newConversation.id,
            {
              data: {
                notificationsCount: 1,
              },
            },
          );
        }
      }

      // Following code handles incoming webhooks from the Nylas
      if (
        ctx.request.body.type &&
        ctx.request.body.type === 'message.created'
      ) {
        const conversation = await strapi.entityService.findMany(
          'api::conversation.conversation',
          {
            filters: {
              threadId: {
                $eq: ctx.request.body.data.object.thread_id,
              },
            },
            populate: ['user', 'tenant'],
          },
        );

        if (conversation.length > 0) {
          SocketIo.emitToUser(conversation[0].user.id, 'message:added', {
            isAdded: true,
          });

          if (
            conversation[0].user.email ===
            ctx.request.body.data.object.to[0].email
          ) {
            const notification = await strapi.entityService.create(
              'api::chat-notification.chat-notification',
              {
                data: {
                  conversation: conversation[0].id,
                  tenant: conversation[0].tenant.id,
                  isActive: true,
                },
              },
            );

            await strapi.entityService.update(
              'api::conversation.conversation',
              conversation[0].id,
              {
                data: {
                  notificationsCount:
                    (conversation[0].notificationsCount || 0) + 1,
                },
              },
            );

            SocketIo.emitToUser(
              conversation[0].user.id,
              'chat-notification:create',
              { notification },
            );
          }
        }

        if (conversation.length === 0) {
          const user = await strapi
            .query('plugin::users-permissions.user')
            .findOne({
              where: { email: ctx.request.body.data.object.to[0].email },
              populate: { tenant: true },
            });

          const service = await strapi.service(
            'api::chat-notification.chat-notification',
          );

          const newConversation = await service.getNewConversation({
            filter: {
              email: {
                $eq: ctx.request.body.data.object.from[0].email,
              },
            },
            data: {
              user: user.id,
              tenant: user.tenant.id,
              threadId: ctx.request.body.data.object.thread_id,
              name: ctx.request.body.data.object.subject,
              type: 'mail',
              uuid: generateUUID(),
            },
            replyAddress: ctx.request.body.data.object.from[0].email,
          });

          const notification = await strapi.entityService.create(
            'api::chat-notification.chat-notification',
            {
              data: {
                conversation: newConversation.id,
                tenant: user.tenant.id,
                isActive: true,
              },
            },
          );

          await strapi.entityService.update(
            'api::conversation.conversation',
            newConversation.id,
            {
              data: {
                notificationsCount: 1,
              },
            },
          );

          SocketIo.emitToUser(user.id, 'chat-notification:create', {
            notification,
          });
        }
      }

      ctx.send('Notification is created', 200);
    },

    async webChat(ctx) {
      handleLogger(
        'info',
        'Controller :: WebChat',
        `Ctx Body :: ${JSON.stringify(ctx.request.body)}`,
      );

      // Following code handles incoming webhook for 'onMessageAdded' and 'onConversationAdded' event from Twilio Web Chat.
      if (
        ctx.request.body.AccountSid &&
        (ctx.request.body.EventType === 'onMessageAdded' ||
          ctx.request.body.EventType === 'onConversationAdded')
      ) {
        const conversationSid = ctx.request.body?.ConversationSid;
        const flexAccountSid = ctx.request.body?.AccountSid;

        const twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: {
              flexAccountSid: {
                $eq: flexAccountSid,
              },
            },
            populate: {
              tenant: {
                populate: {
                  users: {
                    fields: ['id'],
                  },
                },
              },
            },
          },
        );
        const tenant = twilioConnection[0]?.tenant;
        const user = twilioConnection[0]?.tenant.users[0];

        SocketIo.emitToUser(user.id, 'web-chat-message:added', {
          isAdded: true,
        });

        const notification = await strapi.entityService.create(
          'api::chat-notification.chat-notification',
          {
            data: {
              webChatConversation: conversationSid,
              tenant: tenant.id,
              isActive: true,
            },
          },
        );

        SocketIo.emitToUser(user.id, 'chat-notification:create', {
          notification,
        });

        ctx.send('Notified', 200);
      }
    },

    async find(ctx) {
      if (ctx.query.challenge) {
        ctx.response.status = 200;
        ctx.response.body = ctx.query.challenge;
      }
    },
  }),
);

// Webhook data received for the 'onMessageAdded' event: {
//   MessagingServiceSid: 'MG1ef108eaa6c62c93e8cefd0d0a999437',
//     EventType: 'onMessageAdded',
//     Attributes: '{}',
//     DateCreated: '2024-05-22T06:58:41.708Z',
//     Index: '6',
//     ChatServiceSid: 'IS3ac4888d604543fa9228cdb49d791ed7',
//     MessageSid: 'IM482de3653e5f43e2952a2fe92deecd3e',
//     AccountSid: 'AC2ed8ef6137102000bce9d3291ea6250b',
//     Source: 'SMS',
//     RetryCount: '0',
//     Author: '+48792015778',
//     ParticipantSid: 'MB9f8b45e565af480290bdadba68388a7f',
//     Body: 'Test',
//     ConversationSid: 'CH58fb0ea884fa4043bade92c4fd1648cf'
// }
