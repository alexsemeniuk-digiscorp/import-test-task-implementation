import { SocketIo } from '../../socket/SocketIo';
import { TimelineService } from '../TimelineService';

async function getTenant(tenantId: number) {
  return await strapi.entityService.findOne('api::tenant.tenant', tenantId, {
    populate: ['timeline_connection'],
  });
}

async function getTimelineConnection(tenantId: number) {
  const list = await strapi.entityService.findMany(
    'api::timeline-connection.timeline-connection',
    {
      filters: { tenant: { id: tenantId } },
      populate: ['accounts'],
      limit: 1,
    },
  );
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

async function removeTimelineAccountChats(id: string) {
  const conversations = await strapi.entityService.findMany(
    'api::conversation.conversation',
    {
      filters: {
        type: 'wa',
        threadId: id,
      },
    },
  );

  const ids = conversations.map((c) => Number(c.id)).filter(Boolean);

  if (ids.length > 0) {
    await strapi.entityService.deleteMany('api::conversation.conversation', {
      filters: { id: { $in: ids } },
    });
  }
}

async function resolveTenantUser(
  tenantId: number,
  phone: string,
): Promise<any | null> {
  const userByPhone = await strapi
    .query('plugin::users-permissions.user')
    .findOne({
      where: {
        phoneNumber: phone,
        tenant: { id: tenantId },
      },
    });

  if (userByPhone) {
    return userByPhone.id;
  }

  const fallbackUser = await strapi
    .query('plugin::users-permissions.user')
    .findOne({
      where: { tenant: { id: tenantId } },
    });

  if (fallbackUser) {
    return fallbackUser.id as number;
  }

  return null;
}

export default {
  async webhook(ctx) {
    try {
      const body = ctx.request.body || {};
      const tenantIdRaw = ctx.params?.tenantId;
      const eventType = body.event_type as string | undefined;

      if (!eventType) {
        ctx.status = 200;
        ctx.body = 'NO_EVENT_TYPE';
        return;
      }

      switch (eventType) {
        case 'chat:new': {
          const chat = body.chat || {};
          const tenant = await getTenant(tenantIdRaw);

          const user = await resolveTenantUser(
            Number(tenant.id),
            body.whatsapp_account?.phone,
          );

          await strapi.entityService.create('api::conversation.conversation', {
            data: {
              replyTo: `${chat.phone || 'WhatsApp'}`,
              conversationSid: `${chat.id}`,
              type: 'wa',
              tenant: tenant.id,
              isAutocreated: true,
              name: chat.name,
              user: user,
            },
          });

          break;
        }
        case 'message:new': {
          try {
            const body = ctx.request?.body || {};
            const chatId = body?.chat?.chat_id ?? body?.chat_id;
            const waPhone = body?.whatsapp_account?.phone;

            if (!chatId) {
              strapi.log?.warn?.('[Timelines] message:new without chat_id');
              break;
            }

            // Try to find the conversation by chat id
            let conversations = await strapi.entityService.findMany(
              'api::conversation.conversation',
              {
                filters: { conversationSid: { $eq: chatId } },
                populate: ['user', 'tenant'],
                limit: 1,
              },
            );

            let convo = Array.isArray(conversations) ? conversations[0] : null;

            // If not found, create it (handles race with chat:new)
            if (!convo) {
              const tenant = await getTenant(Number(tenantIdRaw));
              const userId = await resolveTenantUser(
                Number(tenant?.id),
                waPhone,
              );
              try {
                const created = await strapi.entityService.create(
                  'api::conversation.conversation',
                  {
                    data: {
                      conversationSid: String(chatId),
                      type: 'wa',
                      tenant: tenant?.id,
                      isAutocreated: true,
                      name:
                        body?.chat?.full_name ?? body?.chat?.name ?? 'WhatsApp',
                      user: userId ?? undefined,
                    },
                  },
                );
                // Reload with relations populated
                conversations = await strapi.entityService.findMany(
                  'api::conversation.conversation',
                  {
                    filters: { id: { $eq: created?.id } },
                    populate: ['user', 'tenant'],
                    limit: 1,
                  },
                );
                convo = Array.isArray(conversations) ? conversations[0] : null;
              } catch (createErr) {
                strapi.log?.error?.(
                  '[Timelines] Failed to create conversation on message:new',
                  createErr,
                );
              }
            }

            if (!convo?.id || !convo?.tenant?.id) {
              strapi.log?.warn?.(
                '[Timelines] message:new: conversation/tenant missing for chat %s',
                String(chatId),
              );
              break;
            }

            // Create chat notification (best-effort)
            let notification: any = null;
            try {
              notification = await strapi.entityService.create(
                'api::chat-notification.chat-notification',
                {
                  data: {
                    conversation: convo.id,
                    tenant: convo.tenant.id,
                    isActive: true,
                  },
                },
              );
            } catch (notifErr) {
              strapi.log?.error?.(
                '[Timelines] Failed to create chat-notification',
                notifErr,
              );
            }

            // Emit only when user exists
            const userId = Number(convo?.user?.id);
            if (userId && notification) {
              try {
                SocketIo.emitToUser(userId, 'chat-notification:create', {
                  notification,
                  conversationUuid: (convo as any)?.uuid || undefined,
                });
                SocketIo.emitToUser(userId, 'message:added', { isAdded: true });
              } catch (emitErr) {
                strapi.log?.error?.('[Timelines] Socket emit failed', emitErr);
              }
            }
          } catch (err) {
            strapi.log?.error?.('[Timelines] message:new handler error', err);
          }

          break;
        }
        case 'whatsapp:account:connected': {
          const tenant = await getTenant(Number(tenantIdRaw));
          const timelineConnection = await getTimelineConnection(
            Number(tenantIdRaw),
          );

          const wa = body.whatsapp_account || {};
          const accountPayload = {
            uid: wa.id ? String(wa.id) : undefined,
            accountName:
              wa.account_name || wa.name || wa.phone || 'WhatsApp Account',
            phone: wa.phone || undefined,
            ownerName: wa.owner_name || undefined,
            email: wa.owner_email || undefined,
          };

          if (timelineConnection) {
            const current = Array.isArray(timelineConnection.accounts)
              ? timelineConnection.accounts
              : [];
            const exists = current.some(
              (a) =>
                a?.uid && accountPayload.uid && a.uid === accountPayload.uid,
            );
            if (!exists) {
              const updated = [...current, accountPayload];
              await strapi.entityService.update(
                'api::timeline-connection.timeline-connection',
                timelineConnection.id,
                {
                  data: { accounts: updated },
                },
              );
            }
          }

          const token =
            timelineConnection?.token || tenant?.timeline_connection?.token;
          if (token) {
            try {
              const timelines = new TimelineService(token);
              const userId = await resolveTenantUser(
                Number(tenant.id),
                wa.phone,
              );
              if (userId) {
                await timelines.uploadChatsToStrapi(Number(tenant.id), userId);
              } else {
                strapi.log?.warn?.(
                  '[Timelines] No user found for chats upload, tenant %s',
                  String(tenant.id),
                );
              }
            } catch (e) {
              strapi.log?.error?.(
                '[Timelines] uploadChatsToStrapi failed on connect for tenant %s: %o',
                String(tenant?.id),
                e,
              );
            }
          } else {
            strapi.log?.warn?.(
              '[Timelines] Missing token to upload chats on connect for tenant %s',
              String(tenant?.id),
            );
          }

          break;
        }
        case 'whatsapp:account:disconnected': {
          const timelineConnection = await getTimelineConnection(
            Number(tenantIdRaw),
          );
          const wa = body.whatsapp_account || {};

          if (timelineConnection) {
            const current = Array.isArray(timelineConnection.accounts)
              ? timelineConnection.accounts
              : [];
            const updated = current.filter((a) => {
              const uid = a?.uid ? String(a.uid) : undefined;
              const phone = a?.phone ? String(a.phone) : undefined;
              const waUid = wa.id ? String(wa.id) : undefined;
              const waPhone = wa.phone ? String(wa.phone) : undefined;

              return !(
                (waUid && uid === waUid) ||
                (waPhone && phone === waPhone)
              );
            });

            if (updated.length !== current.length) {
              await strapi.entityService.update(
                'api::timeline-connection.timeline-connection',
                timelineConnection.id,
                {
                  data: { accounts: updated },
                },
              );
            }
          }

          if (wa.id) {
            await removeTimelineAccountChats(wa.id);
          }

          break;
        }
        default: {
          ctx.status = 200;
          ctx.body = 'UNKNOWN_EVENT_TYPE';
          break;
        }
      }

      ctx.status = 200;
      ctx.body = 'EVENT_RECEIVED';
      return;
    } catch (error) {
      strapi.log?.error?.('Error processing Timelines webhook:', error);
      ctx.status = 500;
      ctx.body = 'Error processing webhook';
      return;
    }
  },
};
