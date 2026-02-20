/**
 * chat-notification service
 */

import { factories } from '@strapi/strapi';
import { Input } from '@strapi/strapi/lib/services/entity-service/types/params/data';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::chat-notification.chat-notification',
  () => ({
    async getNewConversation({
      filter,
      data,
      replyAddress,
    }: {
      filter: AnyObject;
      data: Input<'api::conversation.conversation'>;
      replyAddress: string;
    }) {
      const lead = await strapi.entityService.findMany('api::lead.lead', {
        filters: {
          ...filter,
        },
      });

      const contact = await strapi.entityService.findMany(
        'api::contact.contact',
        {
          filters: {
            ...filter,
          },
        },
      );

      const company = await strapi.entityService.findMany(
        'api::company.company',
        {
          filters: {
            ...filter,
          },
        },
      );

      const newConversation = await strapi.entityService.create(
        'api::conversation.conversation',
        {
          data: {
            ...data,
            contact: contact?.[0]?.id ?? undefined,
            lead:
              !contact?.[0]?.id && lead?.[0]?.id ? lead?.[0]?.id : undefined,
            company: company?.[0]?.id ?? undefined,
            replyTo:
              contact?.[0]?.id || lead?.[0]?.id || company?.[0]?.id
                ? undefined
                : replyAddress,
          },
        },
      );

      return newConversation;
    },
  }),
);
