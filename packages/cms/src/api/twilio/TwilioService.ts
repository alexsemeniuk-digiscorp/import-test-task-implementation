import axios from 'axios';
import fetch from 'node-fetch';
import path from 'path';

import { Twilio } from 'twilio';
import AccessToken, { VoiceGrant } from 'twilio/lib/jwt/AccessToken';
import { AccountInstance } from 'twilio/lib/rest/api/v2010/account';
import { ApplicationInstance } from 'twilio/lib/rest/api/v2010/account/application';
import { NewKeyInstance } from 'twilio/lib/rest/api/v2010/account/newKey';
import { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';
import { MessageInstance } from 'twilio/lib/rest/conversations/v1/conversation/message';
import { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant';

import { handleError, handleLogger } from '../../graphql/helpers/errors';

import { endOfMonth, format, startOfMonth } from 'date-fns';
import { ServiceInstance } from 'twilio/lib/rest/intelligence/v2/service';
import { ServiceInstance as MessagingServiceInstance } from 'twilio/lib/rest/messaging/v1/service';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const frontendUrl = process.env.FRONTEND_URL;
const backendUrl = process.env.ABSOLUTE_URL;

const WEB_CHAT_FRIENDLY_NAMES = ['Web Chat', 'Webchat widget'];

const isAmericanNumber = (phoneNumber: string): boolean => {
  const americanNumberPattern = /^\+1\d{10}$/;
  return americanNumberPattern.test(phoneNumber);
};

export class TwilioService {
  private twilio: Twilio;
  private subaccountSid: string;
  private subaccountAuthToken: string;
  public constructor(_?: string, subaccountSid?: string) {
    handleLogger(
      'info',
      'TwilioServiceConstructor',
      `Subaccount SID: ${subaccountSid}`,
    );
    this.twilio = new Twilio(accountSid, authToken, {
      accountSid: subaccountSid,
    });
    this.subaccountSid = subaccountSid;
  }
  public async updateCall(
    callSid: string,
    options: { twiml: string },
  ): Promise<void> {
    try {
      await this.initializeWithSubaccount();
      await this.twilio.calls(callSid).update(options);
    } catch (error) {
      throw new Error(`Failed to update call: ${error.message}`);
    }
  }
  public async fetchSubaccountAuthToken(): Promise<string> {
    handleLogger(
      'info',
      'fetchSubaccountAuthToken',
      `Subaccount SID: ${this.subaccountSid}`,
    );
    try {
      const account = await this.twilio.api.v2010
        .accounts(this.subaccountSid)
        .fetch();
      return account.authToken;
    } catch (error) {
      handleError(
        'fetchSubaccountAuthToken',
        'Failed to fetch subaccount auth token',
        error,
      );
    }
  }

  public async stopScheduledMessage(scheduleId: string): Promise<void> {
    handleLogger('info', 'stopScheduledMessage', `Schedule ID: ${scheduleId}`);
    try {
      await this.initializeWithSubaccount();
      await this.twilio.messages(scheduleId).update({ status: 'canceled' });
    } catch (error) {
      console.error('Failed to get subaccount SID:', error);
      throw new Error('Failed to get subaccount SID');
    }
  }

  public async removeVoiceIntelligenceService(
    serviceSid: string,
  ): Promise<void> {
    handleLogger(
      'info',
      'removeVoiceIntelligenceService',
      `Service SID: ${serviceSid}`,
    );
    try {
      await this.initializeWithSubaccount();
      await this.twilio.intelligence.v2.services(serviceSid).remove();
    } catch (error) {
      handleError(
        'removeVoiceIntelligenceService',
        'Failed to remove voice intelligence service',
        error,
      );
    }
  }

  public async createVoiceIntelligenceService(
    accountSid: string,
  ): Promise<ServiceInstance> {
    handleLogger(
      'info',
      'createVoiceIntelligenceService',
      `Account SID: ${accountSid}`,
    );
    try {
      const subaccountAuthToken = await this.fetchSubaccountAuthToken();
      const subaccClient = new Twilio(accountSid, subaccountAuthToken);

      return await subaccClient.intelligence.v2.services.create({
        uniqueName: `Transcription-Calls-Service-${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`,
        friendlyName: `Transcription-Calls-Service-${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`,
        autoTranscribe: true,
        webhookUrl: `${frontendUrl}/api/twilio/transcription`,
        webhookHttpMethod: 'POST',
      });
    } catch (e) {
      handleError(
        'createVoiceIntelligenceService',
        'Failed to create voice intelligence service',
        e,
      );
    }
  }

  public async fetchTranscription(transcriptSid: string): Promise<string> {
    handleLogger(
      'info',
      'fetchTranscription',
      `Transcript SID: ${transcriptSid}`,
    );
    try {
      await this.initializeWithSubaccount();
      const sentences = await this.twilio.intelligence.v2
        .transcripts(transcriptSid)
        .sentences.list({ limit: 20 });

      const formattedTranscription = sentences
        .map((sentence) => {
          const role = sentence.mediaChannel === 1 ? 'Agent' : 'Customer';
          const startTimeInSeconds = parseFloat(sentence.startTime.toString());
          const minutes = Math.floor(startTimeInSeconds / 60);
          const seconds = Math.floor(startTimeInSeconds % 60);
          const formattedTime = `${minutes}:${seconds
            .toString()
            .padStart(2, '0')}`;
          return `[${role} ${formattedTime}]: ${sentence.transcript}`;
        })
        .join(' | ');

      return formattedTranscription || '';
    } catch (error) {
      handleError('fetchTranscription', 'Failed to fetch transcription', error);
    }
  }

  public async fetchCallSidFromTranscription(
    transcriptSid: string,
  ): Promise<string> {
    handleLogger(
      'info',
      'fetchCallSidFromTranscription',
      `Transcript SID: ${transcriptSid}`,
    );
    try {
      await this.initializeWithSubaccount();
      const transcript = await this.twilio.intelligence.v2
        .transcripts(transcriptSid)
        .fetch();

      return transcript.channel.media_properties.source_sid;
    } catch (error) {
      handleError(
        'fetchCallSidFromTranscription',
        'Failed to fetch call SID from transcription',
        error,
      );
    }
  }

  public async createTwimlApp(): Promise<ApplicationInstance> {
    handleLogger('info', 'createTwimlApp', 'Creating Twiml app');
    try {
      const applications = await this.twilio.applications.list();

      const existingApp = applications.find(
        (app) => app.friendlyName === 'Application for calls',
      );

      if (existingApp) {
        return existingApp;
      }

      return await this.twilio.applications.create({
        friendlyName: 'Application for calls',
        statusCallback: `${frontendUrl}/api/twilio/status`,
        voiceUrl: `${frontendUrl}/api/twilio/voice`,
      });
    } catch (error) {
      handleError('createTwimlApp', 'Failed to create Twiml app', error);
    }
  }

  public async createApiKeyAndSecret(): Promise<NewKeyInstance> {
    handleLogger(
      'info',
      'createApiKeyAndSecret',
      'Creating API key and secret',
    );
    try {
      return await this.twilio.newKeys.create({
        friendlyName: 'API Key for calls',
      });
    } catch (error) {
      handleError(
        'createApiKeyAndSecret',
        'Failed to create API key and secret',
        error,
      );
    }
  }

  public async createConversation(name: string): Promise<ConversationInstance> {
    handleLogger('info', 'createConversation', `Conversation name: ${name}`);
    try {
      await this.initializeWithSubaccount();

      const existingConversation =
        await this.twilio.conversations.v1.conversations
          .list()
          .then((conversations) =>
            conversations.find(
              (conv) =>
                conv.friendlyName === name &&
                conv.accountSid === this.subaccountSid,
            ),
          );

      if (existingConversation) {
        return {
          ...existingConversation,
          friendlyName: 'Existed',
        } as ConversationInstance;
      }

      return await this.twilio.conversations.v1.conversations.create({
        friendlyName: name,
        uniqueName: name,
      });
    } catch (e) {
      handleError('createConversation', 'Failed to create conversation', e);
    }
  }

  public async createConversationParticipantChat(
    conversationId: string,
    identity: string,
  ): Promise<ParticipantInstance> {
    handleLogger(
      'info',
      'createConversationParticipantChat',
      `Conversation ID: ${conversationId}, Identity: ${identity}`,
    );
    try {
      return await this.twilio.conversations.v1
        .conversations(conversationId)
        .participants.create({ identity });
    } catch (e) {
      handleError(
        'createConversationParticipantChat',
        'Failed to create conversation participant',
        e,
      );
    }
  }

  public async createConversationParticipantSMS(
    conversationId: string,
    twilioNumber: string,
    clientNumber: string,
  ): Promise<ParticipantInstance> {
    handleLogger(
      'info',
      'createConversationParticipantSMS',
      `Conversation ID: ${conversationId}, Twilio number: ${twilioNumber}, Client number: ${clientNumber}`,
    );
    try {
      return await this.twilio.conversations.v1
        .conversations(conversationId)
        .participants.create({
          'messagingBinding.address': clientNumber,
          'messagingBinding.proxyAddress': twilioNumber,
        });
    } catch (e) {
      handleError(
        'createConversationParticipantSMS',
        'Failed to create conversation participant',
        e,
      );
    }
  }

  public async createConversationParticipantWhatsApp(
    conversationId: string,
  ): Promise<ParticipantInstance> {
    handleLogger(
      'info',
      'createConversationParticipantWhatsApp',
      `Conversation ID: ${conversationId}`,
    );
    try {
      return await this.twilio.conversations.v1
        .conversations(conversationId)
        .participants.create({
          'messagingBinding.address': 'whatsapp:+48792015778',
          'messagingBinding.proxyAddress': 'whatsapp:+14155238886',
        });
    } catch (e) {
      handleError(
        'createConversationParticipantWhatsApp',
        'Failed to create conversation participant',
        e,
      );
    }
  }

  public async fetchFileFromUrl(
    url: string,
  ): Promise<{ fileBuffer: Buffer; mimeType: string; fileName: string }> {
    handleLogger('info', 'fetchFileFromUrl', `URL: ${url}`);
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const mimeType = response.headers['content-type'];
      const fileName = path.basename(url.split('?')[0]);

      return {
        fileBuffer: Buffer.from(response.data),
        mimeType,
        fileName,
      };
    } catch (error) {
      handleError('fetchFileFromUrl', 'Failed to fetch file from URL', error);
    }
  }

  public async getAllUploadedFiles(
    ctx: Graphql.ResolverContext,
  ): Promise<Upload.UploadFile[]> {
    handleLogger('info', 'getAllUploadedFiles', 'Fetching all uploaded files');
    try {
      const { authorization } = ctx.koaContext.request.headers;
      const response = await fetch(`${backendUrl}/api/upload/files`, {
        headers: {
          Authorization: authorization,
        },
      });
      if (!response.ok) {
        handleError(
          'getAllUploadedFiles',
          'Failed to get all uploaded files',
          response.statusText,
        );
      }
      return await response.json();
    } catch (error) {
      handleError(
        'getAllUploadedFiles',
        'Failed to get all uploaded files',
        error,
      );
    }
  }

  public async getTwilioMedia(mediaSid: string): Promise<string> {
    handleLogger('info', 'getTwilioMedia', `Media SID: ${mediaSid}`);
    try {
      await this.initializeWithSubaccount();
      const chatServiceSid = await this.twilio.conversations.v1.services
        .list()
        .then((services) => services[0].sid);

      const mediaUrl = `https://mcs.us1.twilio.com/v1/Services/${chatServiceSid}/Media/${mediaSid}`;

      const response = await axios.get(mediaUrl, {
        auth: {
          username: this.subaccountSid,
          password: this.subaccountAuthToken,
        },
      });

      return response.data.links.content_direct_temporary;
    } catch (error) {
      handleError('getTwilioMedia', 'Failed to get Twilio media', error);
    }
  }

  public async uploadMedia(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
    chatServiceSid: string,
  ): Promise<string> {
    handleLogger('info', 'uploadMedia', `Chat service SID: ${chatServiceSid}`);
    try {
      const response = await axios.post(
        `https://mcs.us1.twilio.com/v1/Services/${chatServiceSid}/Media`,
        fileBuffer,
        {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
          auth: {
            username: this.subaccountSid,
            password: this.subaccountAuthToken,
          },
        },
      );

      return response.data.sid;
    } catch (error) {
      handleError('uploadMedia', 'Failed to upload media', error);
    }
  }

  public async createConversationMessage(
    conversationSID: string,
    authorName: string,
    content: string,
    attachmentLinks: string[],
    to: string,
    from: string,
    sendAsMMS: boolean,
    sendAt?: string,
    messagingServiceSid?: string,
  ): Promise<void> {
    handleLogger(
      'info',
      'createConversationMessage',
      `Conversation SID: ${conversationSID}, Author name: ${authorName}, Content: ${content}, Attachment links: ${attachmentLinks}, To: ${to}, From: ${from}, Send as MMS: ${sendAsMMS}, Send at: ${sendAt}, Messaging service SID: ${messagingServiceSid}`,
    );
    try {
      await this.initializeWithSubaccount();

      const messageOptions: any = {
        author: authorName,
        body: content,
      };

      if (sendAsMMS === true) {
        const chatServiceSid = await this.twilio.conversations.v1.services
          .list()
          .then((services) => {
            return services[0].sid;
          });

        const mediaSids: string[] = [];
        for (const url of attachmentLinks) {
          const { fileBuffer, mimeType, fileName } =
            await this.fetchFileFromUrl(url);
          const mediaSid = await this.uploadMedia(
            fileBuffer,
            mimeType,
            fileName,
            chatServiceSid,
          );
          mediaSids.push(mediaSid);
        }

        if (mediaSids.length > 0) {
          messageOptions.mediaSid = mediaSids;
        }

        if (isAmericanNumber(to)) {
          if (sendAt) {
            const scheduledMMS = await this.twilio.messages.create({
              from: from,
              to: to,
              body: content || '',
              mediaUrl: attachmentLinks,
              sendAsMms: true,
            });

            const conversation = await strapi.entityService.findMany(
              'api::conversation.conversation',
              {
                filters: { conversationSid: conversationSID },
                populate: { scheduled: true },
              },
            );

            if (conversation.length === 0) {
              handleError(
                'createConversationMessage',
                'No conversation found',
                'No conversation found',
              );
            }

            const newScheduledMessage = {
              body: content,
              closeTime: sendAt.toString(),
              scheduleId: scheduledMMS.sid,
              attachments: attachmentLinks.join(','),
            };

            const updatedScheduledArray = [
              ...(conversation[0].scheduled || []),
              newScheduledMessage,
            ];

            await strapi.entityService.update(
              'api::conversation.conversation',
              conversation[0].id,
              {
                data: {
                  scheduled: updatedScheduledArray,
                },
              },
            );
          } else {
            const twilioMms = await this.twilio.messages.create({
              from: from,
              to: to,
              body: content || '',
              mediaUrl: attachmentLinks,
              sendAsMms: true,
            });

            const conversation = await strapi.entityService.findMany(
              'api::conversation.conversation',
              {
                filters: { conversationSid: conversationSID },
                populate: { mms: true },
              },
            );

            if (conversation.length === 0) {
              handleError(
                'createConversationMessage',
                'No conversation found',
                'No conversation found',
              );
            }

            const newMMS = {
              url: attachmentLinks[0],
              date: twilioMms.dateCreated.toISOString(),
            };

            const updatedMMSArray = [...(conversation[0].mms || []), newMMS];

            await strapi.entityService.update(
              'api::conversation.conversation',
              conversation[0].id,
              {
                data: {
                  mms: updatedMMSArray,
                },
              },
            );
          }
        } else {
          if (sendAt) {
            const bodyContent = content
              ? attachmentLinks.length > 0
                ? `${content}\nAttachments:\n${attachmentLinks.join('\n')}`
                : content
              : attachmentLinks.length > 0
              ? `Attachments:\n${attachmentLinks.join('\n')}`
              : '';

            const scheduledMessage = await this.twilio.messages.create({
              to: to,
              body: bodyContent,
              sendAt: new Date(Number(sendAt) * 1000),
              messagingServiceSid: messagingServiceSid,
              scheduleType: 'fixed',
            });

            const conversation = await strapi.entityService.findMany(
              'api::conversation.conversation',
              {
                filters: { conversationSid: conversationSID },
                populate: { scheduled: true },
              },
            );

            if (conversation.length === 0) {
              handleError(
                'createConversationMessage',
                'No conversation found',
                'No conversation found',
              );
            }

            const newScheduledMessage = {
              body: content,
              closeTime: sendAt.toString(),
              scheduleId: scheduledMessage.sid,
              attachments: attachmentLinks.join(','),
            };

            const updatedScheduledArray = [
              ...(conversation[0].scheduled || []),
              newScheduledMessage,
            ];

            await strapi.entityService.update(
              'api::conversation.conversation',
              conversation[0].id,
              {
                data: {
                  scheduled: updatedScheduledArray,
                },
              },
            );
          } else {
            await this.twilio.conversations.v1
              .conversations(conversationSID)
              .messages.create({ ...messageOptions });
          }
        }
      } else if (sendAsMMS === false) {
        if (sendAt) {
          const bodyContent = content
            ? attachmentLinks.length > 0
              ? `${content}\nAttachments:\n${attachmentLinks.join('\n')}`
              : content
            : attachmentLinks.length > 0
            ? `Attachments:\n${attachmentLinks.join('\n')}`
            : '';

          const scheduledMessage = await this.twilio.messages.create({
            to: to,
            body: bodyContent,
            sendAt: new Date(Number(sendAt) * 1000),
            messagingServiceSid: messagingServiceSid,
            scheduleType: 'fixed',
          });

          const conversation = await strapi.entityService.findMany(
            'api::conversation.conversation',
            {
              filters: { conversationSid: conversationSID },
              populate: { scheduled: true },
            },
          );

          if (conversation.length === 0) {
            handleError(
              'createConversationMessage',
              'No conversation found',
              'No conversation found',
            );
          }

          const newScheduledMessage = {
            body: content,
            closeTime: sendAt.toString(),
            scheduleId: scheduledMessage.sid,
            attachments: attachmentLinks.join(','),
          };

          const updatedScheduledArray = [
            ...(conversation[0].scheduled || []),
            newScheduledMessage,
          ];

          await strapi.entityService.update(
            'api::conversation.conversation',
            conversation[0].id,
            {
              data: {
                scheduled: updatedScheduledArray,
              },
            },
          );
        } else {
          if (content) {
            await this.twilio.conversations.v1
              .conversations(conversationSID)
              .messages.create(messageOptions);
          }

          for (const attachment of attachmentLinks) {
            const attachmentMessageOptions: any = {
              author: authorName,
              body: attachment,
            };

            await this.twilio.conversations.v1
              .conversations(conversationSID)
              .messages.create(attachmentMessageOptions);
          }
        }
      }
    } catch (e) {
      handleError(
        'createConversationMessage',
        'Failed to create conversation message',
        e,
      );
    }
  }
  public async getConversationMessages(
    conversationSID: string,
    offset: number,
    limit: number,
  ): Promise<MessageInstance[]> {
    handleLogger(
      'info',
      'getConversationMessages',
      `Conversation SID: ${conversationSID}, Offset: ${offset}, Limit: ${limit}`,
    );
    try {
      await this.initializeWithSubaccount();

      let fetched: MessageInstance[] = [];
      let remainingToSkip = offset;
      let remainingToTake = limit;

      let page = await this.twilio.conversations.v1
        .conversations(conversationSID)
        .messages.page({
          pageSize: remainingToSkip + remainingToTake,
          order: 'desc',
        });

      while (true) {
        let items = page.instances;
        if (remainingToSkip > 0) {
          if (items.length <= remainingToSkip) {
            remainingToSkip -= items.length;
            if (page.nextPageUrl) {
              page = await this.twilio.conversations.v1
                .conversations(conversationSID)
                .messages.getPage(page.nextPageUrl);
              continue;
            } else {
              break;
            }
          } else {
            items = items.slice(remainingToSkip);
            remainingToSkip = 0;
          }
        }
        const toTake = Math.min(remainingToTake, items.length);
        fetched = fetched.concat(items.slice(0, toTake));
        remainingToTake -= toTake;

        if (remainingToTake === 0 || !page.nextPageUrl) {
          break;
        }

        page = await this.twilio.conversations.v1
          .conversations(conversationSID)
          .messages.getPage(page.nextPageUrl);
      }

      return fetched;
    } catch (e) {
      handleError(
        'getConversationMessages',
        'Failed to get conversation messages',
        e,
      );
    }
  }
  public async getTotalRecordingTime(
    accountSid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalRecordingTime: string;
    totalSeconds: number;
  }> {
    handleLogger('info', 'getTotalRecordingTime', `Account SID: ${accountSid}`);

    try {
      await this.initializeWithSubaccount();

      const transcripts = await this.twilio.intelligence.v2.transcripts.list();

      let filteredTranscripts = transcripts;
      if (startDate && endDate) {
        filteredTranscripts = transcripts.filter((transcript) => {
          const transcriptDate = new Date(transcript.dateCreated);
          return transcriptDate >= startDate && transcriptDate <= endDate;
        });
      }

      let totalSeconds = 0;
      for (const transcript of filteredTranscripts) {
        if (transcript.duration) {
          totalSeconds += Number(transcript.duration);
        }
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const totalRecordingTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');

      return {
        totalRecordingTime,
        totalSeconds,
      };
    } catch (error) {
      console.error('Error fetching recording time:', error);
      return {
        totalRecordingTime: '00:00:00',
        totalSeconds: 0,
      };
    }
  }
  public async getTotalTranscriptions(
    accountSid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalTranscriptions: number;
  }> {
    handleLogger(
      'info',
      'getTotalTranscriptions',
      `Account SID: ${accountSid}`,
    );

    try {
      await this.initializeWithSubaccount();
      const transcripts = await this.twilio.intelligence.v2.transcripts.list();

      let filteredTranscripts = transcripts;

      if (startDate && endDate) {
        filteredTranscripts = transcripts.filter((transcript) => {
          const transcriptDate = new Date(transcript.dateCreated);
          return transcriptDate >= startDate && transcriptDate <= endDate;
        });
      }

      return {
        totalTranscriptions: filteredTranscripts.length,
      };
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      return {
        totalTranscriptions: 0,
      };
    }
  }
  public async fetchConvByName(friendlyName: string) {
    handleLogger(
      'info',
      'fetchConvByName',
      `Fetching conversation for ${friendlyName}`,
    );
    try {
      await this.initializeWithSubaccount();
      const conversations =
        await this.twilio.conversations.v1.conversations.list();
      return conversations.find((conv) => conv.friendlyName === friendlyName);
    } catch (e) {
      handleError('fetchConvByName', 'Failed to fetch conversation by name', e);
    }
  }
  public async getTotalCallDuration(
    accountSidFromArgs: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalCallTime: string;
    totalSeconds: number;
  }> {
    handleLogger(
      'info',
      'getTotalCallDuration',
      `Account SID: ${accountSidFromArgs}`,
    );
    const subAccAuthToken = await this.fetchSubaccountAuthToken();

    try {
      let twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSidFromArgs}/Calls.json`;

      if (startDate && endDate) {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        twilioApiUrl += `?StartTime>=${formattedStartDate}&StartTime<=${formattedEndDate}`;
      } else {
        const currentDate = new Date();
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        const formattedStartDate = format(monthStart, 'yyyy-MM-dd');
        const formattedEndDate = format(monthEnd, 'yyyy-MM-dd');
        twilioApiUrl += `?StartTime>=${formattedStartDate}&StartTime<=${formattedEndDate}`;
      }

      const response = await axios.get(twilioApiUrl, {
        auth: {
          username: accountSidFromArgs,
          password: subAccAuthToken,
        },
      });

      const totalDuration = response.data.calls.reduce(
        (sum: number, call: { duration: string }) =>
          sum + (parseInt(call.duration) || 0),
        0,
      );

      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const seconds = totalDuration % 60;
      const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      return {
        totalCallTime: formattedDuration,
        totalSeconds: totalDuration,
      };
    } catch (error) {
      console.error('Error fetching call time:', error);

      return {
        totalCallTime: '00:00:00',
        totalSeconds: 0,
      };
    }
  }

  public async getMessageCounts(
    accountSid: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    outgoingSmsCount: number;
    incomingSmsCount: number;
    outgoingMmsCount: number;
    incomingMmsCount: number;
  }> {
    handleLogger('info', 'getMessageCounts', `Account SID: ${accountSid}`);

    try {
      await this.initializeWithSubaccount();

      const now = new Date();
      const firstDayOfMonth =
        startDate || new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth =
        endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const messages = await this.twilio.messages.list({
        dateSentAfter: firstDayOfMonth,
        dateSentBefore: lastDayOfMonth,
      });

      let outgoingSmsCount = 0;
      let incomingSmsCount = 0;
      let outgoingMmsCount = 0;
      let incomingMmsCount = 0;

      for (const message of messages) {
        const hasMedia = message.numMedia && parseInt(message.numMedia) > 0;
        const isOutgoing = message.direction.includes('outbound');
        const isIncoming = message.direction.includes('inbound');

        if (hasMedia) {
          if (isOutgoing) outgoingMmsCount++;
          if (isIncoming) incomingMmsCount++;
        } else {
          if (isOutgoing) outgoingSmsCount++;
          if (isIncoming) incomingSmsCount++;
        }
      }

      return {
        outgoingSmsCount,
        incomingSmsCount,
        outgoingMmsCount,
        incomingMmsCount,
      };
    } catch (error) {
      console.error('Error fetching message counts:', error);
      return {
        outgoingSmsCount: 0,
        incomingSmsCount: 0,
        outgoingMmsCount: 0,
        incomingMmsCount: 0,
      };
    }
  }

  public async fetchConversations(conversationSID: string) {
    handleLogger(
      'info',
      'fetchConv',
      `Fetching conversation: ${conversationSID}`,
    );
    try {
      await this.initializeWithSubaccount();
      return await this.twilio.conversations.v1
        .conversations(conversationSID)
        .fetch();
    } catch (e) {
      handleError('fetchConv', 'Failed to fetch conversation', e);
    }
  }

  public async addParticipant(
    conversationSID: string,
    clientNumber: string,
    twilioNumber: string,
  ) {
    handleLogger(
      'info',
      'addParticipant',
      `Adding participant to ${conversationSID}`,
    );
    try {
      await this.initializeWithSubaccount();
      return await this.twilio.conversations.v1
        .conversations(conversationSID)
        .participants.create({
          'messagingBinding.address': clientNumber,
          'messagingBinding.proxyAddress': twilioNumber,
        });
    } catch (e) {
      handleError('addParticipant', 'Failed to add participant', e);
    }
  }

  public async sendMessageToConversation(
    conversationSID: string,
    authorName: string,
    content: string,
    attachmentLinks: string[] = [],
  ) {
    handleLogger(
      'info',
      'sendMessage',
      `Sending message to ${conversationSID}`,
    );
    try {
      await this.initializeWithSubaccount();

      const messageOptions: any = { author: authorName, body: content };

      if (attachmentLinks.length > 0) {
        messageOptions.mediaSid = await Promise.all(
          attachmentLinks.map(async (url) => {
            const { fileBuffer, mimeType, fileName } =
              await this.fetchFileFromUrl(url);
            return this.uploadMedia(
              fileBuffer,
              mimeType,
              fileName,
              await this.getChatServiceSid(),
            );
          }),
        );
      }

      return await this.twilio.conversations.v1
        .conversations(conversationSID)
        .messages.create(messageOptions);
    } catch (e) {
      handleError('sendMessage', 'Failed to send message', e);
    }
  }
  private async getChatServiceSid(): Promise<string> {
    return this.twilio.conversations.v1.services
      .list()
      .then((services) => services[0].sid);
  }
  public async createConversationService(serviceName: string) {
    handleLogger(
      'info',
      'createConversationService',
      `Service name: ${serviceName}`,
    );
    try {
      await this.initializeWithSubaccount();
      const newService = await this.twilio.conversations.v1.services.create({
        friendlyName: serviceName,
      });

      return newService;
    } catch (e) {
      handleError(
        'createConversationService',
        'Failed to create conversation service',
        e,
      );
    }
  }

  public async createConversationApiKey(
    apiKeyName: string,
  ): Promise<NewKeyInstance> {
    handleLogger(
      'info',
      'createConversationApiKey',
      `API key name: ${apiKeyName}`,
    );
    try {
      return await this.twilio.newKeys.create({
        friendlyName: apiKeyName,
      });
    } catch (e) {
      handleError(
        'createConversationApiKey',
        'Failed to create conversation key',
        e,
      );
    }
  }

  public async removeConversationApiKey(keySid: string): Promise<boolean> {
    handleLogger('info', 'removeConversationApiKey', `Key SID: ${keySid}`);
    try {
      return await this.twilio.keys(keySid).remove();
    } catch (e) {
      handleError(
        'removeConversationApiKey',
        'Failed to remove conversation key',
        e,
      );
    }
  }

  public async createConversationAccessToken(
    subaccountSid: string,
    apiKeySid: string,
    apiKeySecret: string,
    chatServiceSid: string,
    identity: string,
  ): Promise<string> {
    handleLogger(
      'info',
      'createConversationAccessToken',
      `Subaccount SID: ${subaccountSid}, API key SID: ${apiKeySid}, API key secret: ${apiKeySecret}, Chat service SID: ${chatServiceSid}, Identity: ${identity}`,
    );
    try {
      const ChatGrant = AccessToken.ChatGrant;

      const chatGrant = new ChatGrant({
        serviceSid: chatServiceSid,
      });

      const token = new AccessToken(subaccountSid, apiKeySid, apiKeySecret, {
        identity: identity,
      });

      token.addGrant(chatGrant);

      return token.toJwt();
    } catch (e) {
      handleError(
        'createConversationAccessToken',
        'Failed to create conversation access token',
        e,
      );
    }
  }

  public async createVoiceAccessToken(
    subaccountSid: string,
    apiKeySid: string,
    apiKeySecret: string,
    outgoingApplicationSid: string,
    identity?: string,
  ): Promise<string> {
    handleLogger(
      'info',
      'createVoiceAccessToken',
      `Subaccount SID: ${subaccountSid}, API key SID: ${apiKeySid}, API key secret: ${apiKeySecret}, Outgoing application SID: ${outgoingApplicationSid}, Identity: ${identity}`,
    );
    try {
      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid,
        incomingAllow: true,
      });

      const token = new AccessToken(subaccountSid, apiKeySid, apiKeySecret, {
        identity: identity,
      });

      token.addGrant(voiceGrant);

      return token.toJwt();
    } catch (e) {
      handleError(
        'createVoiceAccessToken',
        'Failed to create voice access token',
        e,
      );
    }
  }

  public async createSubaccount(
    friendlyName: string,
  ): Promise<AccountInstance> {
    handleLogger('info', 'createSubaccount', `Friendly name: ${friendlyName}`);
    try {
      return await this.twilio.api.v2010.accounts.create({
        friendlyName,
      });
    } catch (e) {
      handleError('createSubaccount', 'Failed to create subaccount', e);
    }
  }

  public async getPhoneNumber() {
    handleLogger('info', 'getPhoneNumber', 'Getting available phone number');
    try {
      const [phone] = await this.twilio
        .availablePhoneNumbers('US')
        .local.list({ limit: 1 });

      return phone;
    } catch (e) {
      handleError('getPhoneNumber', 'Failed to get phone number', e);
    }
  }

  public async addPhoneNumber(phoneNumber: string): Promise<string> {
    try {
      const newPhoneNumber = await this.twilio.incomingPhoneNumbers.create({
        phoneNumber,
        voiceUrl: `${frontendUrl}/api/twilio/voice`,
        voiceMethod: 'POST',
        statusCallback: `${frontendUrl}/api/twilio/status`,
      });

      return newPhoneNumber.sid;
    } catch (e) {
      handleError('addPhoneNumber', 'Failed to add phone number', e);
    }
  }

  public async createMessagingService(
    friendlyName: string,
    phoneSid: string,
  ): Promise<MessagingServiceInstance> {
    handleLogger('info', 'createMessagingService', 'CreatingMessagingService');
    try {
      await this.initializeWithSubaccount();

      const service = await this.twilio.messaging.v1.services.create({
        friendlyName,
        stickySender: true,
        inboundMethod: 'POST',
        inboundRequestUrl: `${frontendUrl}/api/twilio/incomingSms`,
      });

      await this.twilio.messaging.v1.services(service.sid).phoneNumbers.create({
        phoneNumberSid: phoneSid,
      });

      await this.twilio.conversations.v1.configuration.webhooks().update({
        filters: ['onMessageAdded'],
        method: 'POST',
        postWebhookUrl: `${frontendUrl}/api/chat-notifications`,
      });

      return service;
    } catch (e) {
      handleError(
        'createMessagingService',
        'Failed to create messaging service',
        e,
      );
    }
  }

  public async sendSMS({ body, twilioNumber, clientNumber }): Promise<void> {
    handleLogger(
      'info',
      'sendSMS',
      `Body: ${body}, Twilio number: ${twilioNumber}, Client number: ${clientNumber}`,
    );
    try {
      await this.initializeWithSubaccount();
      await this.twilio.messages.create({
        from: twilioNumber,
        to: clientNumber,
        body: body ?? '',
      });
    } catch (e) {
      handleError('sendSMS', 'Failed to send SMS', e);
    }
  }

  public async sendMMS({
    from,
    to,
    body,
    mediaUrl,
  }: {
    from: string;
    to: string;
    body: string;
    mediaUrl: string[];
  }): Promise<void> {
    handleLogger(
      'info',
      'sendMMS',
      `From: ${from}, To: ${to}, Body: ${body}, Media URL: ${mediaUrl}`,
    );
    try {
      await this.initializeWithSubaccount();
      await this.twilio.messages.create({
        from,
        to,
        body,
        mediaUrl,
      });
    } catch (e) {
      handleError('sendMMS', 'Failed to send MMS', e);
    }
  }

  public async getAccountFriendlyName(accountSid: string): Promise<string> {
    handleLogger(
      'info',
      'getAccountFriendlyName',
      `Account SID: ${accountSid}`,
    );
    try {
      const account = await this.twilio.api.v2010.accounts(accountSid).fetch();

      return account.friendlyName;
    } catch (e) {
      handleError(
        'getAccountFriendlyName',
        'Failed to get account friendly name',
        e,
      );
    }
  }

  public async deleteConversation(sid: string): Promise<void> {
    handleLogger('info', 'deleteConversation', `Conversation SID: ${sid}`);
    try {
      await this.initializeWithSubaccount();
      await this.twilio.conversations.v1.conversations(sid).remove();
    } catch (e) {
      handleError('deleteConversation', 'Failed to delete conversation', e);
    }
  }

  public async setAddressConfiguration(
    friendlyName: string,
    phoneNumber: string,
  ): Promise<void> {
    handleLogger(
      'info',
      'setAddressConfiguration',
      `Friendly name: ${friendlyName}, Phone number: ${phoneNumber}`,
    );
    try {
      await this.initializeWithSubaccount();

      const configuration = await this.twilio.conversations.v1
        .configuration()
        .fetch();

      await this.twilio.conversations.v1.addressConfigurations.create({
        'friendlyName': friendlyName,
        'autoCreation.enabled': true,
        'autoCreation.type': 'webhook',
        'autoCreation.conversationServiceSid':
          configuration.defaultChatServiceSid,
        'autoCreation.webhookUrl': `${backendUrl}/api/chat-notifications`,
        'autoCreation.webhookMethod': 'POST',
        'autoCreation.webhookFilters': ['onMessageAdded'],
        'type': 'sms',
        'address': phoneNumber,
      });
    } catch (e) {
      handleError(
        'setAddressConfiguration',
        'Failed to set address configuration',
        e,
      );
    }
  }

  private async initializeWithSubaccount(): Promise<void> {
    handleLogger(
      'info',
      'initializeWithSubaccount',
      'Initializing with subaccount',
    );
    try {
      const subaccountAuthToken = await this.fetchSubaccountAuthToken();
      this.twilio = new Twilio(this.subaccountSid, subaccountAuthToken);
      this.subaccountAuthToken = subaccountAuthToken;
    } catch (error) {
      handleError(
        'initializeWithSubaccount',
        'Failed to initialize with subaccount',
        error,
      );
    }
  }
  public async getWebChatConversations(): Promise<any> {
    handleLogger('info', 'TwilioService :: getWebChatConversations', '');
    try {
      await this.initializeWithSubaccount();

      const conversations =
        await this.twilio.conversations.v1.conversations.list();

      const webСhatConversationsList = conversations.filter((conversation) =>
        WEB_CHAT_FRIENDLY_NAMES.includes(conversation.friendlyName),
      );

      const res = await this.getAccountFriendlyName(
        'AC5ca8dddd1a01846102c94d1dc367367e',
      );

      return webСhatConversationsList;
    } catch (e) {
      handleError(
        'getWebChatConversations',
        `Error while fetching web chat conversations: ${e}`,
        ``,
      );
    }
  }
  public async getWebChatMessages(
    conversationSid: string,
    limit?: number,
  ): Promise<any> {
    handleLogger(
      'info',
      'TwilioService :: getWebChatMessages',
      `Params: ConSid ${conversationSid}, Limit ${limit}`,
    );
    try {
      await this.initializeWithSubaccount();

      const messages = await this.twilio.conversations.v1
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
  }
  public async sendWebChatMessage(
    conversationSid: string,
    message: string,
    userName: string,
  ): Promise<any> {
    handleLogger(
      'info',
      'TwilioService :: sendWebChatMessage',
      `Params: ConSid ${conversationSid}, Message ${message} userName ${userName}`,
    );
    try {
      await this.initializeWithSubaccount();
      const messageResponse = await this.twilio.conversations.v1
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
  }
}
