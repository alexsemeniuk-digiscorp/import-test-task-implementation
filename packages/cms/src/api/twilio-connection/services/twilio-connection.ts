/**
 * twilio-connection service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import sanitize from 'sanitize-filename';
import { Twilio } from 'twilio';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { TwilioService } from '../../twilio/TwilioService';

const backendUrl = process.env.ABSOLUTE_URL;

const WEB_CHAT_FRIENDLY_NAMES = ['Web Chat', 'Webchat widget'];

export default factories.createCoreService(
  'api::twilio-connection.twilio-connection',
  () => ({
    async createTwimlApp(connectionId: ID) {
      handleLogger(
        'info',
        'Func :: createTwimlApp',
        `Params: {connectionId: ${connectionId}}`,
      );
      const client = new TwilioService();
      const twimlApp = await client.createTwimlApp();

      return twimlApp;
    },
    async sendSMS(connectionId: ID, clientNumber: string, smsData?: string) {
      const connection = await strapi.entityService.findOne(
        'api::twilio-connection.twilio-connection',
        connectionId,
      );
      const client = new TwilioService(
        connection.messagingServiceSid,
        connection.accountSid,
      );

      await client
        .sendSMS({
          body: smsData,
          twilioNumber: connection.phoneNumber,
          clientNumber,
        })
        .catch((e) => {
          console.log(e);
          strapi.log.error(e);
        });
    },
    async sendMMS(
      connectionId: ID,
      to: string,
      body: string,
      mediaUrl: string[],
    ) {
      const connection = await strapi.entityService.findOne(
        'api::twilio-connection.twilio-connection',
        connectionId,
      );
      const client = new TwilioService(
        connection.messagingServiceSid,
        connection.accountSid,
      );

      await client
        .sendMMS({
          from: connection.phoneNumber,
          to,
          body,
          mediaUrl,
        })
        .catch((e) => {
          console.log(e);
          strapi.log.error(e);
        });
    },
    async getUploadedMediaUrl(
      mediaUrl: string,
      ctx: Graphql.ResolverContext,
    ): Promise<string | null> {
      handleLogger(
        'info',
        'Func :: getUploadedMediaUrl',
        `Params: ${mediaUrl}`,
      );

      try {
        const { authorization } = ctx.koaContext.request.headers;
        const mediaFilename = path.basename(mediaUrl.split('?')[0]);

        const queryUrl = `${backendUrl}/api/upload/files?filters[name][$eq]=${encodeURIComponent(
          mediaFilename,
        )}`;
        const response = await fetch(queryUrl, {
          headers: {
            Authorization: authorization,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const files = await response.json();
        if (files && files.length > 0) {
          const uploadedFile = files[0];
          return uploadedFile.url || null;
        } else {
          return null;
        }
      } catch (error) {
        handleError('getUploadedMediaUrl', error);
        return null;
      }
    },
    async uploadTwilioMedia(
      mediaUrl: string,
      ctx: Graphql.ResolverContext,
    ): Promise<string | null> {
      handleLogger(
        'info',
        'Func :: uploadTwilioMedia',
        `Params: ${mediaUrl} , ${ctx}`,
      );
      const mediaFilename = path.basename(mediaUrl.split('?')[0]);
      const sanitizedFilename = sanitize(mediaFilename);
      const tempFilePath = `/tmp/${sanitizedFilename}`;

      try {
        const response = await fetch(mediaUrl);

        if (!response.ok) {
          throw new Error(`Failed to download media: ${response.status}`);
        }

        const buffer = await response.buffer();
        fs.writeFileSync(tempFilePath, buffer);

        const form = new FormData();
        form.append('files', fs.createReadStream(tempFilePath), {
          filename: sanitizedFilename,
          contentType: response.headers.get('content-type'),
        });

        const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
          method: 'POST',
          body: form,
          headers: {
            Authorization: ctx.koaContext.request.headers.authorization,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload media: ${uploadResponse.status}`);
        }

        const uploadedFile = await uploadResponse.json();
        return uploadedFile[0].url;
      } catch (error) {
        handleError('uploadTwilioMedia', error);
        return null;
      } finally {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    },
    async isTwilioMediaUploaded(
      mediaUrl: string,
      ctx: Graphql.ResolverContext,
    ): Promise<boolean> {
      handleLogger(
        'info',
        'Func :: isTwilioMediaUploaded',
        `Params: ${mediaUrl}`,
      );

      try {
        const { authorization } = ctx.koaContext.request.headers;
        const mediaFilename = path.basename(mediaUrl.split('?')[0]);

        const queryUrl = `${backendUrl}/api/upload/files?filters[name][$eq]=${encodeURIComponent(
          mediaFilename,
        )}`;
        const response = await fetch(queryUrl, {
          headers: { Authorization: authorization },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const files = await response.json();
        return Array.isArray(files) && files.length > 0;
      } catch (error) {
        handleError('isTwilioMediaUploaded', error);
        return false;
      }
    },
    async createConversation(
      accountSid: string,
      name: string,
      type: string,
      twilioNumber: string,
      clientNumber: string,
    ) {
      const client = new TwilioService('', accountSid);
      const newConversation = await client.createConversation(name);

      if (newConversation.friendlyName !== 'Existed') {
        await client.createConversationParticipantChat(
          newConversation.sid,
          `${name}-${type}-${new Date().getTime()}`,
        );

        if (type === 'sms') {
          await client.createConversationParticipantSMS(
            newConversation.sid,
            twilioNumber,
            clientNumber,
          );
        }

        if (type === 'whatsApp') {
          await client.createConversationParticipantWhatsApp(
            newConversation.sid,
          );
        }
      }

      return newConversation;
    },
    async createConversationMessage(
      accountSid: string,
      conversationSid: string,
      author: string,
      content: string,
      attachments: string[],
      to: string,
      from: string,
      sendAsMMS: boolean,
      sendAt?: string,
      messagingServiceSid?: string,
    ) {
      const client = new TwilioService('', accountSid);

      const message = await client.createConversationMessage(
        conversationSid,
        author,
        content,
        attachments,
        to,
        from,
        sendAsMMS,
        sendAt,
        messagingServiceSid,
      );

      return message;
    },
    async getConversationMessages(
      accountSid: string,
      conversationSid: string,
      offset: number,
      limit: number,
      ctx: Graphql.ResolverContext,
    ) {
      const client = new TwilioService('', accountSid);

      const messageList = await client.getConversationMessages(
        conversationSid,
        offset,
        limit,
      );

      return messageList.map((message) => ({
        media: message.media,
        body: message.body,
        sid: message.sid,
        date: message.dateCreated,
        isIncome: message.author.includes('+'),
      }));
    },
    async getTwilioMediaToMessage(accountSid: string, messageSid: string) {
      const client = new TwilioService('', accountSid);
      const media = await client.getTwilioMedia(messageSid);
      return media;
    },
    async createConversationAccessToken(
      accountSid: string,
      connectionId: ID,
      identity: string,
    ) {
      handleLogger(
        'info',
        'Func :: createConversationAccessToken',
        `Params: {accountSid: ${accountSid}, connectionId: ${connectionId}, identity: ${identity}}`,
      );
      const client = new TwilioService('', accountSid);
      const connection = await strapi.entityService.findOne(
        'api::twilio-connection.twilio-connection',
        connectionId,
      );

      let keySid = connection.keySid;
      let keySecret = connection.keySecret;

      if (!keySid || !keySecret) {
        try {
          const keyData = await client.createApiKeyAndSecret();
          keySid = keyData.sid;
          keySecret = keyData.secret;

          await strapi.entityService.update(
            'api::twilio-connection.twilio-connection',
            connectionId,
            {
              data: {
                keySid,
                keySecret,
              },
            },
          );
        } catch (error) {
          handleError('createConversationAccessToken', error);
        }
      }

      try {
        const token = await client.createConversationAccessToken(
          connection.accountSid,
          keySid,
          keySecret,
          connection.conversationServiceSid,
          identity,
        );

        return token;
      } catch (error) {
        handleError('createConversationAccessToken', error);
      }
    },
    async createSubaccount(friendlyName: string) {
      const client = new TwilioService();

      const subaccount = await client.createSubaccount(friendlyName);
      const { phoneNumber, phoneSid } = await this.addSubaccountNumber(
        subaccount.sid,
      );

      const messagingServiceSid = await this.addSubaccountMessagingService(
        subaccount.sid,
        `${friendlyName} Messaging Service`,
        phoneSid,
      );

      await this.addWebhook(
        subaccount.sid,
        `${friendlyName} Messaging Service`,
        phoneNumber,
      );

      return {
        subaccountSid: subaccount.sid,
        messagingServiceSid,
        phoneNumber,
      };
    },
    async stopScheduledMessage(accountSid: string, scheduledMessageId: string) {
      const client = new TwilioService('', accountSid);
      await client.stopScheduledMessage(scheduledMessageId);
    },
    async addSubaccountNumber(accountSid: string) {
      const client = new TwilioService('', accountSid);

      const phone = await client.getPhoneNumber();

      const newPhoneNumber = await client.addPhoneNumber(phone.phoneNumber);

      return { phoneNumber: phone.phoneNumber, phoneSid: newPhoneNumber };
    },
    async addSubaccountMessagingService(
      accountSid: string,
      friendlyName: string,
      phoneSid: string,
    ) {
      const client = new TwilioService('', accountSid);

      const messagingService = await client.createMessagingService(
        `${friendlyName} Messaging Service`,
        phoneSid,
      );

      return messagingService.sid;
    },
    async addWebhook(
      accountSid: string,
      friendlyName: string,
      phoneNumber: string,
    ) {
      const client = new TwilioService('', accountSid);

      await client.setAddressConfiguration(friendlyName, phoneNumber);
    },
    async deleteConversation(accountSid: string, conversationSid: string) {
      const client = new TwilioService('', accountSid);
      await client.deleteConversation(conversationSid);
    },
    async addWebChatWebhook(flexAccSid: string, flexAccToken: string) {
      handleLogger(
        'info',
        'Twilio Connection Service :: addWebChatWebhook',
        '',
      );
      if (process.env.FRONTEND_URL.includes('local'))
        return handleLogger(
          'warn',
          'Twilio Connection Service :: addWebChatWebhook',
          "It's localhost. Don't create webhook",
        );
      try {
        const twilio = await new Twilio(flexAccSid, flexAccToken);
        await twilio.conversations.v1.configuration.webhooks().update({
          filters: ['onMessageAdded', 'onConversationAdded'],
          method: 'POST',
          postWebhookUrl: `${process.env.FRONTEND_URL}/api/web-chat`,
        });
      } catch (e) {
        handleError(
          'addWebChatWebhook',
          `Error while adding webhook: ${e}`,
          ``,
        );
      }
    },
    async getWebChatConversations(
      flexAccSid: string,
      flexAccToken: string,
    ): Promise<any> {
      handleLogger(
        'info',
        'Twilio Connection Service :: getWebChatConversations',
        '',
      );
      try {
        const twilio = await new Twilio(flexAccSid, flexAccToken);
        const conversations =
          await twilio.conversations.v1.conversations.list();

        const webСhatConversationsList = conversations.filter((conversation) =>
          WEB_CHAT_FRIENDLY_NAMES.includes(conversation.friendlyName),
        );

        return webСhatConversationsList;
      } catch (e) {
        handleError(
          'getWebChatConversations',
          `Error while fetching web chat conversations: ${e}`,
          ``,
        );
      }
    },
    async getWebChatMessages(
      flexAccSid: string,
      flexAccToken: string,
      conversationSid: string,
      limit?: number,
    ): Promise<any> {
      handleLogger(
        'info',
        'Twilio Connection Service :: getWebChatMessages',
        `Params: ConSid ${conversationSid}, Limit ${limit}`,
      );
      try {
        const twilio = await new Twilio(flexAccSid, flexAccToken);

        const messages = await twilio.conversations.v1
          .conversations(conversationSid)
          .messages.list({ limit });

        return messages;
      } catch (e) {
        handleError(
          'getWebChatMessages',
          `Error while fetching web chat messages: ${e}`,
          ``,
        );
      }
    },
    async sendWebChatMessage(
      flexAccSid: string,
      flexAccToken: string,
      conversationSid: string,
      message: string,
      userName: string,
    ): Promise<any> {
      handleLogger(
        'info',
        'Twilio Connection Service :: sendWebChatMessage',
        `Params: ConSid ${conversationSid}, Message ${message} userName ${userName}`,
      );
      try {
        const twilio = await new Twilio(flexAccSid, flexAccToken);

        const messageResponse = await twilio.conversations.v1
          .conversations(conversationSid)
          .messages.create({ author: userName, body: message });

        return messageResponse;
      } catch (e) {
        handleError(
          'sendWebChatMessage',
          `Error while sending web chat message: ${e}`,
          ``,
        );
      }
    },
  }),
);
