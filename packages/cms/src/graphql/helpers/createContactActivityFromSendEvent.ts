import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

type EntityType =
  | 'contract'
  | 'form'
  | 'invoice'
  | 'appraisal'
  | 'estimate'
  | 'purchase'
  | 'review'
  | 'shipment'
  | 'reminder'
  | 'task'
  | 'marketing';

type ChannelType = 'email' | 'sms' | 'mms';

const createContactActivityFromSendEvent = async (
  contactId: string,
  channel: ChannelType,
  type: EntityType,
  desc: string,
  tenantId: string,
  contactType: 'lead' | 'contact' | 'company',
) => {
  const relation =
    contactType === 'contact'
      ? { contact_id: contactId as ID }
      : contactType === 'lead'
      ? { lead_id: contactId as ID }
      : { company_id: contactId as ID };

  switch (type) {
    case 'contract': {
      const { recipient, link } = JSON.parse(desc);
      const descriptionMessage = `The contract was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Contract sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'form': {
      const { recipient, link } = JSON.parse(desc);
      const descriptionMessage = `The form was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Form sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'appraisal': {
      const { recipient, link } = JSON.parse(desc);
      const descriptionMessage = `The appraisal was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Appraisal sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'shipment': {
      const { recipient, id } = JSON.parse(desc);
      const descriptionMessage = `The shipment notification was sent to ${recipient} for order ${id}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Shipment sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'review': {
      const { recipient, link, orderId, order } = JSON.parse(desc);
      const descriptionMessage = `The review request was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Review request sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
          order: order ?? null,
        },
      });
      break;
    }

    case 'invoice': {
      const { recipient, link, order } = JSON.parse(desc);
      const descriptionMessage = `Invoice was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Invoice sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
          order: order ?? null,
        },
      });
      break;
    }

    case 'estimate': {
      const { recipient, link } = JSON.parse(desc);
      const descriptionMessage = `The estimate was sent to ${recipient} ${link}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Estimate sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'purchase': {
      const { recipient } = JSON.parse(desc);
      const descriptionMessage = `A purchase request was sent by ${
        channel !== 'email' ? channel.toUpperCase() : channel
      } to ${recipient}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Purchase Request sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'reminder': {
      const { recipient } = JSON.parse(desc);
      const descriptionMessage = `A payment reminder was sent by email to ${recipient}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Payment reminder sent by email`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    case 'task': {
      const { recipient, order } = JSON.parse(desc);
      const descriptionMessage = `A task completion notification was sent by ${
        channel !== 'email' ? channel.toUpperCase() : channel
      } to ${recipient}`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Task completion notification sent by ${
            channel !== 'email' ? channel.toUpperCase() : channel
          }`,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
          order: order ?? null,
        },
      });
      break;
    }

    case 'marketing': {
      const { stepName, name } = JSON.parse(desc);
      const descriptionMessage = `Step ${stepName} ${
        channel !== 'email' ? channel.toUpperCase() : channel
      } sent for ${name} Campaign`;

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: descriptionMessage,
          ...relation,
          description: descriptionMessage,
          type: 'send',
          notes: channel,
          tenant: tenantId as ID,
          due_date: new Date(),
        },
      });
      break;
    }

    default:
      break;
  }
};

export default createContactActivityFromSendEvent;
