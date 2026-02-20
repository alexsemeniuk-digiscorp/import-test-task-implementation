import { jwt } from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { SocketIo } from '../../socket/SocketIo';
import { TwilioService } from '../../twilio/TwilioService';
import {
  createConversationRecord,
  findContactOrLead,
  findTwilioConnectionByAccountSid,
  getOrCreateConversation,
  getTenantWithUsers,
  processIncomingMedia,
} from '../utils';
import { handleRecordSource } from '../utils/handleRecording';

const frontendUrl = process.env.FRONTEND_URL;

function isAValidPhoneNumber(number) {
  const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
  return phoneNumberPattern.test(number);
}

export default {
  async handleIncomingMessage(ctx) {
    handleLogger(
      'info',
      'handleIncomingMessage - twilio.ts',
      'Processing incoming SMS/MMS',
    );

    const {
      From: senderNumber,
      Body: messageBody,
      To: twilioNumber,
      AccountSid: accSid,
      NumMedia: numMedia,
    } = ctx.request.body;

    if (!senderNumber) {
      handleError('handleIncomingMessage - twilio.ts', 'Invalid message data');
      return ctx.badRequest('Missing sender number');
    }

    try {
      const twilioConnection = await findTwilioConnectionByAccountSid(accSid);
      const tenantId = twilioConnection.tenant.id;
      const tenant = await getTenantWithUsers(tenantId);

      const client = new TwilioService('', twilioConnection.accountSid);

      let mediaUrls = [];
      if (numMedia && parseInt(numMedia) > 0) {
        const mediaResult = await processIncomingMedia(
          ctx.request.body,
          numMedia,
          twilioConnection,
          tenantId,
        );
        mediaUrls = mediaResult.mediaUrls;
      }

      const conversation = await getOrCreateConversation(
        client,
        tenantId,
        senderNumber,
        twilioNumber,
      );

      const existingConversation = await strapi.entityService.findMany(
        'api::conversation.conversation',
        {
          filters: {
            conversationSid: conversation.sid || conversation.conversationSid,
          },
        },
      );

      if (existingConversation.length === 0) {
        const { entity: contact, isContact } = await findContactOrLead(
          senderNumber,
          tenantId,
        );

        const newConv = await createConversationRecord({
          conversationSid: conversation.sid,
          tenant: tenantId,
          name: `Conversation with ${senderNumber}`,
          type: 'sms',
          isAutocreated: true,
          ...(isContact ? { contact: contact.id } : { lead: contact.id }),
          user: tenant.users[0].id,
          twilioConnection: twilioConnection.id,
        });

        await strapi.entityService.create(
          'api::chat-notification.chat-notification',
          {
            data: {
              conversation: newConv.id,
              tenant: tenantId,
              isActive: true,
            },
          },
        );
      }

      let fullMessage = messageBody || '';
      if (mediaUrls.length > 0) {
        mediaUrls.forEach((url) => {
          fullMessage += `\n${url}`;
        });
      }

      await client.sendMessageToConversation(
        conversation.sid,
        senderNumber,
        fullMessage,
      );

      ctx.send({
        message: 'Message processed successfully',
        mediaUrls,
      });
    } catch (error) {
      handleError('handleIncomingMessage - twilio.ts', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to process incoming message' };
    }
  },
  async generateToken(ctx) {
    handleLogger(
      'info',
      'generateToken - twilio.ts',
      'Generating token for Twilio',
    );
    try {
      const { userId } = ctx.query;
      const decodedUserId = atob(userId);
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: decodedUserId },
          populate: { tenant: true },
        });

      const tenant = user.tenant;

      if (!user || !user.tenant) {
        handleError('User or tenant not found');
        throw new Error('User or tenant not found');
      }

      const twilioConnection = await strapi.entityService.findMany(
        'api::twilio-connection.twilio-connection',
        {
          filters: {
            tenant: {
              id: {
                $eq: tenant.id,
              },
            },
          },
        },
      );

      if (!twilioConnection || twilioConnection.length === 0) {
        handleError('generateToken - twilio.ts', 'Twilio connection not found');
        throw new Error('Twilio connection not found');
      }

      const connection = twilioConnection[0];

      let keyData = {
        sid: connection.keySid,
        secret: connection.keySecret,
      };

      const client = new TwilioService('', connection.accountSid);

      if (!connection.keySid || !connection.keySecret) {
        keyData = await client.createApiKeyAndSecret();
        await strapi.entityService.update(
          'api::twilio-connection.twilio-connection',
          connection.id,
          {
            data: {
              keySid: keyData.sid,
              keySecret: keyData.secret,
            },
          },
        );
      }

      const twimlApp = await client.createTwimlApp();

      const AccessToken = jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;
      const accessToken = new AccessToken(
        connection.accountSid,
        keyData.sid,
        keyData.secret,
        {
          identity: user.email,
        },
      );

      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: twimlApp.sid.toString(),
        incomingAllow: true,
      });

      accessToken.addGrant(voiceGrant);

      ctx.send({
        token: accessToken.toJwt(),
      });
    } catch (error) {
      handleError('generateToken - twilio.ts', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to generate Twilio token' };
    }
  },
  async handleTranscription(ctx) {
    handleLogger(
      'info',
      'handleTranscription - twilio.ts',
      'Handling transcription',
    );
    const { transcript_sid, account_sid } = ctx.request.body;

    if (!transcript_sid) {
      handleError(
        'handleTranscription - twilio.ts',
        'Transcript SID not found',
      );
      return ctx.badRequest('Transcript SID not found');
    }

    try {
      const twilioClient = new TwilioService('', account_sid);
      const transcription = await twilioClient.fetchTranscription(
        transcript_sid,
      );

      const recordSid = await twilioClient.fetchCallSidFromTranscription(
        transcript_sid,
      );

      const call = await strapi.entityService.findMany('api::call.call', {
        filters: { recordSid: recordSid },
      });

      if (call.length === 0) {
        handleError('handleTranscription - twilio.ts', 'Call not found');
        return ctx.notFound('Call not found');
      }

      await strapi.entityService.update('api::call.call', call[0].id, {
        data: {
          transcription: transcription,
        },
      });

      ctx.send({ message: 'Transcription received and call updated' });
    } catch (error) {
      handleError('handleTranscription - twilio.ts', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to update call with transcription' };
    }
  },
  async handleVoice(ctx) {
    handleLogger('info', 'handleVoice - twilio.ts', 'Handling voice call');
    const { To: toNumberOrClientName } = ctx.request.body;

    const twilioConnection = await strapi.entityService.findMany(
      'api::twilio-connection.twilio-connection',
      {
        filters: {
          accountSid: {
            $eq: ctx.request.body.AccountSid,
          },
        },
      },
    );

    if (!twilioConnection || twilioConnection.length === 0) {
      handleError('handleVoice - twilio.ts', 'Twilio connection not found');
      return ctx.badRequest('Twilio connection not found');
    }

    const connection = twilioConnection[0];

    const callerId = connection.phoneNumber;

    const twiml = new VoiceResponse();

    if (toNumberOrClientName === callerId) {
      const dial = twiml.dial({
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallback: `${frontendUrl}/api/twilio/recording-status`,
      });

      const lastCall = await strapi.entityService.findMany('api::call.call', {
        filters: { to: ctx.request.body.From },
        sort: { createdAt: 'desc' },
        limit: 1,
      });

      if (lastCall.length > 0) {
        const identity = lastCall[0].identity;

        SocketIo.io.emit('incomingCall', {
          from: ctx.request.body.From,
          callSid: ctx.request.body.CallSid,
        });
        dial.client(identity);

        const user = await strapi
          .query('plugin::users-permissions.user')
          .findOne({
            where: { email: identity },
            populate: { tenant: true },
          });

        const call = await strapi.entityService.create('api::call.call', {
          data: {
            tenant: user.tenant.id,
            to: ctx.request.body.To,
            from: ctx.request.body.From,
            parentCallSid: ctx.request.body.CallSid,
            status: ctx.request.body.CallStatus,
            identity: identity,
          },
        });

        const { entity, isContact } = await findContactOrLead(
          ctx.request.body.From,
          user.tenant.id,
        );

        if (entity) {
          await strapi.entityService.create('api::activity.activity', {
            data: {
              title: 'Call',
              ...(isContact
                ? { contact_id: entity.id }
                : { lead_id: entity.id }),
              description: `Outgoing call to ${ctx.request.body.To}`,
              type: 'record',
              tenant: user.tenant.id,
              call: call.id,
              due_date: call.createdAt,
            },
          });
        }
      } else {
        handleError('handleVoice - twilio.ts', 'Client not found');
        twiml.say(
          'Sorry, we could not find the client you are trying to call.',
        );
      }
    } else if (toNumberOrClientName) {
      const dial = twiml.dial({
        callerId,
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallback: `${frontendUrl}/api/twilio/recording-status`,
      });

      const attr = isAValidPhoneNumber(toNumberOrClientName)
        ? 'number'
        : 'client';
      dial[attr]({}, toNumberOrClientName);

      const identityFromCtx = ctx.request.body.Caller.replace(/^client:/, '');
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { email: identityFromCtx },
          populate: { tenant: true },
        });

      const call = await strapi.entityService.create('api::call.call', {
        data: {
          tenant: user.tenant.id,
          to: ctx.request.body.To,
          from: ctx.request.body.From,
          callSid: ctx.request.body.CallSid,
          status: ctx.request.body.CallStatus,
          identity: identityFromCtx,
        },
      });

      const { entity, isContact } = await findContactOrLead(
        ctx.request.body.To,
        user.tenant.id,
      );

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: 'Call',
          ...(isContact ? { contact_id: entity.id } : { lead_id: entity.id }),
          description: `Incoming call from ${ctx.request.body.From}`,
          type: 'record',
          tenant: user.tenant.id,
          call: call.id,
          due_date: call.createdAt,
        },
      });
    } else {
      handleError('handleVoice - twilio.ts', 'Invalid number or client name');
      twiml.say('Thanks for calling!');
    }

    ctx.status = 200;
    ctx.set('Content-Type', 'text/xml');
    ctx.body = twiml.toString();
  },
  async handleStatus(ctx) {
    handleLogger('info', 'handleStatus - twilio.ts', 'Handling call status');
    if (!ctx.request.body) {
      return ctx.badRequest('Body is undefined');
    }

    const { CallSid, CallStatus, CallDuration, AccountSid } = ctx.request.body;

    try {
      SocketIo.io.emit('callStatus', { callSid: CallSid, status: CallStatus });

      let call = await strapi.entityService.findMany('api::call.call', {
        filters: { callSid: CallSid },
      });

      if (call.length === 0) {
        call = await strapi.entityService.findMany('api::call.call', {
          filters: { parentCallSid: CallSid },
        });

        if (call.length === 0) {
          handleError('handleStatus - twilio.ts', 'Call not found');
          return ctx.notFound('Call not found');
        }
      }

      await strapi.entityService.update('api::call.call', call[0].id, {
        data: {
          duration: CallDuration,
          status: CallStatus,
        },
      });

      if (CallStatus === 'completed') {
        setTimeout(async () => {
          const twilioClient = new TwilioService('', AccountSid);
          const twilioAuthToken = await twilioClient.fetchSubaccountAuthToken();

          await handleRecordSource(
            call[0].id,
            call[0].callSid,
            call[0].record,
            AccountSid,
            twilioAuthToken,
          );
        }, 60000);
      }

      ctx.send({ message: 'Status received and call updated' });
    } catch (error) {
      handleError('handleStatus - twilio.ts', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to update call' };
    }
  },
  async transferCall(ctx) {
    handleLogger('info', 'transferCall - twilio.ts', 'Transferring call');
    const { CallSid, clientId, tenant } = ctx.request.body;

    if (!CallSid) {
      handleError('transferCall - twilio.ts', 'CallSid not found');
      return ctx.badRequest('CallSid not found');
    }

    try {
      const twilioConnection = await strapi.entityService.findMany(
        'api::twilio-connection.twilio-connection',
        {
          filters: {
            tenant: {
              id: {
                $eq: tenant,
              },
            },
          },
        },
      );

      const twilioClient = new TwilioService(
        '',
        twilioConnection[0].accountSid,
      );

      const twiml = new VoiceResponse();
      twiml.dial().client(clientId);

      await twilioClient.updateCall(CallSid, {
        twiml: twiml.toString(),
      });

      ctx.send({ message: 'Call transferred successfully' });
    } catch (error) {
      handleError('transferCall - twilio.ts', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to transfer call' };
    }
  },
};
