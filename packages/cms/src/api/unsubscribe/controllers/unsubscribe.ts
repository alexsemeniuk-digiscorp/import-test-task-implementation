export default {
  async unsubscribe(ctx) {
    const { source, type } = ctx.request.query;
    const { token } = ctx.params;

    try {
      if (source === 'platform') {
        const api = {
          contact: 'api::campaign-enrolled-contact.campaign-enrolled-contact',
          lead: 'api::campaign-enrolled-contact.campaign-enrolled-contact',
        };
        const contactsApi = 'api::contact.contact';

        const contacts = await strapi.entityService.findMany(api[type], {
          filters: {
            token: {
              $eq: token,
            },
            isUnsubscribed: {
              $eq: false,
            },
          },
          populate: ['contact'],
          fields: ['id', 'isUnsubscribed'],
        });

        if (contacts.length > 0) {
          await strapi.entityService.update(api[type], contacts[0]?.id, {
            data: {
              isUnsubscribed: true,
            },
          });

          if (type === 'contact' && contacts[0]?.contact) {
            await strapi.entityService.update(
              contactsApi,
              contacts[0]?.contact?.id,
              {
                data: {
                  marketingOptIn: 'No',
                },
              },
            );
          }
        }

        ctx.send('Contact is unsubscribed successfully', 200);
      }
    } catch (error) {
      strapi.log.error('An error occurred while unsubscribing:', error);
      return ctx.send(
        'An error occurred while unsubscribing. Please try again later.',
        500,
      );
    }
  },
};
