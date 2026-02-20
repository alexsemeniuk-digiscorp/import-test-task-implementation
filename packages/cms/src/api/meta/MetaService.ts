import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import fetch from 'node-fetch';
import { SocketIo } from '../socket/SocketIo';

export class MetaService {
  private readonly FACEBOOK_API_VERSION = 'v23.0';
  private readonly BASE_URL = `https://graph.facebook.com/${this.FACEBOOK_API_VERSION}`;

  public async getConversationMessagesCursor(opts: {
    conversationId: string;
    accessToken: string;
    limit?: number;
    after?: string;
    before?: string;
    pageUrl?: string;
  }): Promise<{ messages: any[]; paging: any }> {
    const {
      conversationId,
      accessToken,
      limit = 25,
      after,
      before,
      pageUrl,
    } = opts;
    const base = `${this.BASE_URL}/${conversationId}/messages`;
    const params = new URLSearchParams({
      fields: 'message,from,to,created_time,id,attachments{image_data}',
      limit: String(limit),
      access_token: accessToken,
    });
    if (after) params.set('after', after);
    if (before) params.set('before', before);

    const url = pageUrl ?? `${base}?${params.toString()}`;
    const resp = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await resp.json();
    if (!resp.ok)
      throw new Error(
        `Facebook API error: ${JSON.stringify(data?.error ?? data)}`,
      );
    return { messages: data?.data ?? [], paging: data?.paging ?? {} };
  }

  public async sendMessage(
    recipientId: string,
    message: string,
    pageAccessToken: string,
    mediaUrl?: string,
  ): Promise<any> {
    try {
      const url = `${this.BASE_URL}/me/messages`;

      const messagePayload: any = {
        recipient: { id: recipientId },
        message: { text: message },
      };

      if (mediaUrl) {
        const isImage = /(\.(jpg|jpeg|png|gif|webp))$/i.test(mediaUrl);
        const isVideo = /(\.(mp4|webm|ogg|mov))$/i.test(mediaUrl);

        if (isImage) {
          messagePayload.message.attachment = {
            type: 'image',
            payload: { url: mediaUrl, is_reusable: true },
          };
        } else if (isVideo) {
          messagePayload.message.attachment = {
            type: 'video',
            payload: { url: mediaUrl, is_reusable: true },
          };
        } else {
          messagePayload.message.attachment = {
            type: 'file',
            payload: { url: mediaUrl, is_reusable: true },
          };
        }
      }

      const response = await fetch(`${url}?access_token=${pageAccessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        const apiErr = data?.error || {};
        const isOutsideWindow = apiErr.code === 10;
        if (isOutsideWindow) {
          throw new Error(
            "[FB_OUTSIDE_24H_WINDOW] Facebook policy: Messages can only be sent within 24 hours of the user's last message. Ask the recipient to message you first.",
          );
        }

        throw new Error(apiErr.message || 'Failed to send message');
      }

      return data;
    } catch (error) {
      strapi.log.error('Failed to send Facebook message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  public async findExistingConversation(
    threadId: string,
    recipientId: string,
    type: 'fb' | 'insta',
  ) {
    return await strapi.entityService.findMany(
      'api::conversation.conversation',
      {
        filters: { threadId, metaPageId: recipientId, type },
        populate: ['chatNotifications', 'user', 'tenant'],
        limit: 1,
      },
    );
  }

  public async resolveMetaConnection(recipientId: string) {
    const metaConnections: any = await strapi.entityService.findMany(
      'api::meta-connection.meta-connection',
      {
        filters: { pages: { pageId: recipientId } },
        populate: ['tenant'],
        limit: 1,
      },
    );

    if (!Array.isArray(metaConnections) || metaConnections.length === 0) {
      return {
        metaConn: null,
        metaConnFull: null,
        tenantId: undefined,
        pageToken: undefined,
        pageEntry: undefined,
      };
    }

    const metaConn = metaConnections[0];
    const tenantId = metaConn.tenant?.id as number | string | undefined;

    const metaConnFull: any = await strapi.entityService.findOne(
      'api::meta-connection.meta-connection',
      metaConn.id,
      { populate: ['tenant', 'pages'] },
    );

    const pageEntry = metaConnFull?.pages?.find(
      (p: any) => p.pageId === recipientId,
    );
    const pageToken = pageEntry?.token as string | undefined;

    return { metaConn, metaConnFull, tenantId, pageToken, pageEntry };
  }

  public async enrichFacebook(
    pageToken: string | undefined,
    senderId: string,
    baseName: string,
    baseReplyTo: string,
  ) {
    let conversationName = baseName;
    let replyTo = baseReplyTo;
    if (pageToken) {
      try {
        const profileResp = await fetch(
          `${this.BASE_URL}/${senderId}?fields=first_name,last_name,profile_pic&access_token=${pageToken}`,
        );
        const profile = await profileResp.json();
        if (profile?.first_name || profile?.last_name) {
          const fullName = [profile.first_name, profile.last_name]
            .filter(Boolean)
            .join(' ');
          if (fullName) {
            conversationName = `FB Conversation with ${fullName}`;
            replyTo = fullName;
          }
        }
      } catch (e) {
        strapi.log.warn(
          `FB profile lookup failed for PSID ${senderId}: ${e?.message || e}`,
        );
      }
    }
    return { conversationName, replyTo };
  }

  public async resolveFacebookConversationId(
    pageToken: string | undefined,
    recipientId: string,
    senderId: string,
  ) {
    let fbConvId: string | undefined = undefined;
    if (pageToken) {
      try {
        let nextUrl:
          | string
          | null = `${this.BASE_URL}/${recipientId}/conversations?fields=id,participants&limit=25&access_token=${pageToken}`;
        for (let i = 0; i < 3 && nextUrl; i++) {
          const convResp = await fetch(nextUrl);
          const convData = await convResp.json();
          const convList: any[] = Array.isArray(convData?.data)
            ? convData.data
            : [];
          const match = convList.find((c) => {
            const parts = c?.participants?.data || [];
            return parts.some((p: any) => String(p.id) === String(senderId));
          });
          if (match) {
            fbConvId = match.id as string | undefined;
            break;
          }
          nextUrl = convData?.paging?.next || null;
        }
      } catch (e) {
        strapi.log.warn(
          `FB conversations lookup failed for page ${recipientId}: ${
            e?.message || e
          }`,
        );
      }
    }
    return fbConvId;
  }

  public async enrichInstagram(
    pageToken: string | undefined,
    metaConnFull: any,
    recipientId: string,
    senderId: string,
    baseName: string,
    baseReplyTo: string,
  ) {
    let conversationName = baseName;
    const replyTo = baseReplyTo;
    let igConvId: string | undefined = undefined;

    const pageEntry = metaConnFull?.pages?.find(
      (p: any) => p.pageId === recipientId,
    );
    const parentPageId =
      pageEntry?.parentPageId || pageEntry?.pageId || recipientId;

    if (pageToken) {
      try {
        let nextUrl:
          | string
          | null = `${this.BASE_URL}/${parentPageId}/conversations?fields=id,participants&platform=instagram&limit=25&access_token=${pageToken}`;

        for (let i = 0; i < 3 && nextUrl; i++) {
          const convResp = await fetch(nextUrl);
          const convData = await convResp.json();
          const convList: any[] = Array.isArray(convData?.data)
            ? convData.data
            : [];

          const match = convList.find((c) => {
            const parts = c?.participants?.data || [];
            return parts.some((p: any) => String(p.id) === String(senderId));
          });

          if (match) {
            igConvId = match.id as string | undefined;
            const parts: any[] = match.participants?.data || [];
            const nonPage = parts.find(
              (p: any) =>
                String(p.id) !== String(recipientId) &&
                String(p.id) !== String(parentPageId),
            );
            const username = nonPage?.username as string | undefined;
            if (username) {
              conversationName = `Instagram DM with ${username}`;
            }
            break;
          }

          nextUrl = convData?.paging?.next || null;
        }
      } catch (e) {
        strapi.log.warn(
          `IG conversation lookup failed for page ${recipientId}: ${
            e?.message || e
          }`,
        );
      }
    }

    return { conversationName, replyTo, igConvId };
  }

  public async assignTenantUser(tenantId: number | string | undefined) {
    let assignedUserId: number | undefined = undefined;
    if (!tenantId) return assignedUserId;
    try {
      const tenantWithUsers = await strapi.entityService.findOne(
        'api::tenant.tenant',
        tenantId as ID,
        { populate: { users: true } },
      );
      if (
        Array.isArray(tenantWithUsers?.users) &&
        tenantWithUsers.users.length > 0
      ) {
        const rawId = tenantWithUsers.users[0].id as number | string;
        assignedUserId =
          typeof rawId === 'number' ? rawId : Number.parseInt(rawId, 10);
        if (Number.isNaN(assignedUserId)) assignedUserId = undefined;
      }
    } catch (e) {
      strapi.log.warn(
        `Could not fetch tenant users for tenant ${tenantId}: ${
          e?.message || e
        }`,
      );
    }
    return assignedUserId;
  }

  public async createChatNotification(
    conversationId: number,
    tenantId: number | string,
  ) {
    return await strapi.entityService.create(
      'api::chat-notification.chat-notification',
      {
        data: {
          conversation: conversationId,
          tenant: tenantId as ID,
          isActive: true,
        },
      },
    );
  }

  public notifyUser(userId: number | undefined) {
    if (!userId) return;
    SocketIo.emitToUser(userId, 'message:added', { isAdded: true });
  }

  public async handleIncomingMessaging(body: any) {
    if (
      !body ||
      !(body.object === 'page' || body.object === 'instagram') ||
      !Array.isArray(body.entry)
    ) {
      return;
    }

    for (const entry of body.entry) {
      if (!entry.messaging) continue;
      for (const event of entry.messaging) {
        if (!event.message || event.message.is_echo) continue;

        const senderId = event.sender.id as string;
        const recipientId = event.recipient.id as string;
        const platformType: 'fb' | 'insta' =
          body.object === 'instagram' ? 'insta' : 'fb';

        const found: any = await this.findExistingConversation(
          senderId,
          recipientId,
          platformType,
        );

        if (Array.isArray(found) && found.length > 0) {
          const existingConversation = found[0];
          await this.createChatNotification(
            existingConversation.id,
            existingConversation.tenant.id,
          );
          this.notifyUser(existingConversation.user?.id);
          continue;
        }

        try {
          const { metaConn, metaConnFull, tenantId, pageToken, pageEntry } =
            await this.resolveMetaConnection(recipientId);
          if (!metaConn || !tenantId) {
            strapi.log.warn(
              'No meta-connection found for page/account or no tenant linked:',
              recipientId,
            );
            continue;
          }

          let conversationName =
            platformType === 'insta' ? 'Instagram DM' : 'FB Conversation with';
          let replyTo: string = senderId;

          if (platformType === 'insta') {
            const pageName = pageEntry?.name as string | undefined;
            if (pageName) replyTo = pageName;
          }

          if (platformType === 'fb') {
            const enriched = await this.enrichFacebook(
              pageToken,
              senderId,
              conversationName,
              replyTo,
            );
            conversationName = enriched.conversationName;
            replyTo = enriched.replyTo;
          }

          let fbConvId: string | undefined = undefined;
          if (platformType === 'fb') {
            fbConvId = await this.resolveFacebookConversationId(
              pageToken,
              recipientId,
              senderId,
            );
          }

          let igConvId: string | undefined = undefined;
          if (platformType === 'insta') {
            const enrichedIg = await this.enrichInstagram(
              pageToken,
              metaConnFull,
              recipientId,
              senderId,
              conversationName,
              replyTo,
            );
            conversationName = enrichedIg.conversationName;
            replyTo = enrichedIg.replyTo;
            igConvId = enrichedIg.igConvId;
          }

          const assignedUserId = await this.assignTenantUser(tenantId);

          const newConversation = await strapi.entityService.create(
            'api::conversation.conversation',
            {
              data: {
                type: platformType,
                threadId: senderId,
                metaPageId: recipientId,
                tenant: tenantId as ID,
                isAutocreated: true,
                name: conversationName,
                replyTo,
                ...(platformType === 'insta' && igConvId
                  ? { conversationSid: igConvId }
                  : {}),
                ...(platformType === 'fb' && fbConvId
                  ? { conversationSid: fbConvId }
                  : {}),
                ...(assignedUserId ? { user: assignedUserId } : {}),
              },
            },
          );

          await this.createChatNotification(
            Number(newConversation.id),
            tenantId,
          );
        } catch (err) {
          strapi.log.error(
            'Failed to auto-create conversation for incoming event:',
            err,
          );
        }
      }
    }
  }

  public async handleOAuthCallback(
    ctx: any,
    params: {
      code: string;
      stateString: string;
      absoluteUrl: string;
      metaAppId?: string;
      metaAppSecret?: string;
    },
  ) {
    const { code, stateString, absoluteUrl, metaAppId, metaAppSecret } = params;

    if (!code || !stateString) {
      return ctx.badRequest('Missing required parameters');
    }

    let state: any;
    try {
      state = JSON.parse(decodeURIComponent(stateString as string));
    } catch (error) {
      return ctx.badRequest('Invalid state parameter');
    }

    if (!state.userId) {
      return ctx.badRequest('User ID not found in state');
    }

    let user: any;
    try {
      user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        state.userId,
        { populate: ['tenant'] },
      );
      if (!user) {
        return ctx.badRequest('User not found');
      }
    } catch (error) {
      strapi.log.error('Error fetching user:', error);
      return ctx.badRequest('Failed to fetch user');
    }

    try {
      const clientId = metaAppId;
      const clientSecret = metaAppSecret;
      const redirectUri = `${absoluteUrl}/api/meta/callback`;

      const tokenResponse = await fetch(
        `${this.BASE_URL}/oauth/access_token?` +
          `client_id=${clientId}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&client_secret=${clientSecret}` +
          `&code=${code}`,
      );

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error('No access token received from Facebook');
      }

      const longLivedResponse = await fetch(
        `${this.BASE_URL}/oauth/access_token?` +
          `grant_type=fb_exchange_token&` +
          `client_id=${clientId}&` +
          `client_secret=${clientSecret}&` +
          `fb_exchange_token=${tokenData.access_token}`,
      );

      const longLivedData = await longLivedResponse.json();
      const userAccessToken =
        longLivedData.access_token || tokenData.access_token;

      const pagesResponse = await fetch(
        `${this.BASE_URL}/me/accounts?fields=id,name,access_token,category,connected_instagram_account&access_token=${userAccessToken}`,
      );
      const pagesData = await pagesResponse.json();
      if (!pagesData.data || !pagesData.data.length) {
        throw new Error('No pages found for this user');
      }

      const instaPages: any[] = [];
      for (const page of pagesData.data) {
        if (page.connected_instagram_account) {
          try {
            const igId = page.connected_instagram_account.id;
            const igResponse = await fetch(
              `${this.BASE_URL}/${igId}?fields=username,name&access_token=${page.access_token}`,
            );
            const igData = await igResponse.json();
            if (igData?.id) {
              instaPages.push({
                pageId: igData.id,
                name: `${igData.username || page.name}`,
                token: page.access_token,
                parentPageId: page.id,
                type: 'ig',
              });
            }
          } catch (err) {
            strapi.log.error(`Failed to fetch IG info for ${page.name}:`, err);
          }
        }
      }

      await strapi.entityService.create(
        'api::meta-connection.meta-connection',
        {
          data: {
            tenant: user.tenant.id,
            facebookUserToken: userAccessToken,
            pages: [
              ...pagesData.data.map((page: any) => ({
                pageId: page.id,
                name: page.name,
                token: page.access_token,
                type: 'fb',
              })),
              ...instaPages,
            ],
          },
        },
      );

      const metaConnectionService = strapi.service(
        'api::meta-connection.meta-connection',
      );

      for (const page of pagesData.data) {
        try {
          const subscribeUrl = `${this.BASE_URL}/${page.id}/subscribed_apps`;
          const fields = 'messages';
          const resp = await fetch(
            `${subscribeUrl}?subscribed_fields=${encodeURIComponent(
              fields,
            )}&access_token=${page.access_token}`,
            { method: 'POST' },
          );
          const data = await resp.json();
          if (!resp.ok || (data.success !== true && data.success !== 'true')) {
            strapi.log.error(
              `Failed to subscribe page ${page.name} (${
                page.id
              }) to webhooks: ${JSON.stringify(data)}`,
            );
          } else {
            strapi.log.info(
              `Subscribed page ${page.name} (${page.id}) to webhooks: ${fields}`,
            );
          }

          const result = await metaConnectionService.bootstrapConversations(
            page.id,
            page.access_token,
            user.tenant.id,
            state.userId,
          );
          strapi.log.info(`Bootstrapped page ${page.name}:`, result);
        } catch (err: any) {
          strapi.log.error(
            `Bootstrap/subscription failed for page ${page.name}: ${err.message}`,
          );
        }
      }

      for (const instPage of instaPages) {
        try {
          const result =
            await metaConnectionService.bootstrapInstagramConversations(
              instPage.parentPageId,
              instPage.token,
              user.tenant.id,
              state.userId,
              instPage.pageId,
            );
          strapi.log.info(`Bootstrapped page ${instPage.name}:`, result);
        } catch (err: any) {
          strapi.log.error(
            `Bootstrap failed for page ${instPage.name}: ${err.message}`,
          );
        }
      }

      ctx.redirect(
        `${absoluteUrl}/${user.tenant.slug}/dashboard/settings/messaging-settings?facebook_connected=true`,
      );
    } catch (error: any) {
      strapi.log.error('Facebook callback error:', error);
      ctx.redirect(
        `${absoluteUrl}/${
          user?.tenant?.slug ?? ''
        }/dashboard/settings/meta?facebook_error=${encodeURIComponent(
          error.message || 'Failed to authenticate with Facebook',
        )}`,
      );
    }
  }
}
