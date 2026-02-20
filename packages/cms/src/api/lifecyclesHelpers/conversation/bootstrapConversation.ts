import { capitalize } from 'lodash';
import { LifecycleHook } from '../types';

const createActivity = async (conversation, companion) => {
  const isContact = conversation.contact ? true : false;

  await strapi.entityService.create('api::activity.activity', {
    data: {
      title: `${
        conversation.type === 'sms'
          ? 'SMS'
          : conversation.type === 'mail'
          ? 'E-Mail'
          : capitalize(conversation.type)
      } Conversation Created`,
      ...(isContact ? { contact_id: companion.id } : { lead_id: companion.id }),
      description: `Conversation created with ${companion.fullName}`,
      type: 'conversation',
      tenant: conversation.tenant.id,
      due_date: conversation.createdAt,
      conversation: conversation.id,
    },
  });
};

export const bootstrapConversation: LifecycleHook = async ({
  result,
  params,
}) => {
  const conversation = await strapi.entityService.findOne(
    'api::conversation.conversation',
    result.id,
    {
      fields: ['id', 'type', 'createdAt', 'isAutocreated'],
      populate: {
        tenant: {
          fields: ['id', 'slug'],
        },
        twilioConnection: {
          fields: ['id'],
        },
        contact: {
          fields: ['id', 'fullName'],
        },
        lead: {
          fields: ['id', 'fullName'],
        },
      },
    },
  );

  if (
    conversation.type === 'fb' ||
    conversation.type === 'insta' ||
    conversation.type === 'wa'
  ) {
    return;
  }

  const companion = conversation.contact || conversation.lead;
  if (companion) {
    await createActivity(conversation, companion);
  }
  if (conversation.type === 'mail' || conversation.isAutocreated) {
    return;
  }

  if (conversation.type === 'sms') {
    let contact = null;
    if (params.data.contact) {
      contact = await strapi.entityService.findOne(
        'api::contact.contact',
        params.data.contact,
      );
    } else if (params.data.lead) {
      contact = await strapi.entityService.findOne(
        'api::lead.lead',
        params.data.lead,
      );
    }

    const twilioConnection = await strapi.entityService.findMany(
      'api::twilio-connection.twilio-connection',
      {
        filters: {
          tenant: {
            id: conversation.tenant.id,
          },
        },
        fields: ['id', 'accountSid', 'phoneNumber', 'conversationServiceSid'],
      },
    );

    const twilio = await strapi.service(
      'api::twilio-connection.twilio-connection',
    );

    const newConversation = await twilio.createConversation(
      twilioConnection[0].accountSid,
      `${contact?.fullName}-${result.type}`,
      result.type,
      twilioConnection[0].phoneNumber,
      contact.phoneNumber,
    );

    if (!twilioConnection[0].conversationServiceSid) {
      const token = await twilio.createConversationAccessToken(
        twilioConnection[0].accountSid,
        twilioConnection[0].id,
        conversation.tenant.slug,
      );

      await strapi.entityService.update(
        'api::twilio-connection.twilio-connection',
        twilioConnection[0].id,
        {
          data: {
            conversationServiceSid: newConversation.chatServiceSid,
            token,
          },
        },
      );
    }

    if (newConversation.friendlyName === 'Existed') {
      await strapi.entityService.delete(
        'api::conversation.conversation',
        result.id,
      );

      throw new Error(
        `The ${result.type} conversation with ${contact.fullName} already exists`,
      );
    } else {
      await strapi.entityService.update(
        'api::conversation.conversation',
        result.id,
        {
          data: {
            replyTo: contact.fullName || '',
            twilioConnection: twilioConnection[0].id,
            conversationSid: newConversation.sid,
          },
        },
      );
    }
  }
};
