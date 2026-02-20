import { woocommerceApi } from '../../helpers/woocommerceApi';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createEcommerceContact =
  (entityName: string): LifecycleHook =>
  async ({ result, params }: AfterLifecycleEvent) => {
    // Skip create ecommerce contact during bulk imports for performance
    if (params?.data?._skipCreateEcommerceContact) {
      delete params?.data?._skipCreateEcommerceContact;
      return;
    }

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id: result?.id },
      populate: ['tenant', 'ecommerceContactServices'],
    });

    if (contact?.isCreatedByOpenApi) {
      return;
    }

    const ecommerceStores = await strapi.db
      .query('api::ecommerce-detail.ecommerce-detail')
      .findMany({
        where: { tenant: contact?.tenant?.id },
      });

    if (ecommerceStores?.length === 0) {
      return null;
    }

    for (let index = 0; index < ecommerceStores?.length; index++) {
      const store = ecommerceStores[index];
      const storeUrl = store?.storeUrl;
      const accessToken = store?.accessToken;
      const consumerKey = store?.consumerKey;
      const consumerSecret = store?.consumerSecret;
      const contactService = strapi.service('api::contact.contact');

      if (store?.ecommerceType === 'shopify') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: {
              contact: contact?.id,
              ecommerceType: 'shopify',
              isSynced: true,
            },
          });
        if (ecommerceContact) {
          continue;
        }
        contactService?.syncContactWithShopify(
          contact?.id,
          storeUrl,
          accessToken,
          'create',
        );
      } else if (store?.ecommerceType === 'woocommerce') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: {
              contact: contact?.id,
              ecommerceType: 'woocommerce',
              isSynced: true,
            },
          });

        if (ecommerceContact) {
          continue;
        }
        const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);
        try {
          const checkResponse = await api.get('customers', {
            email: contact?.email,
          });
          if (checkResponse?.data?.length > 0) {
            continue;
          }
          contactService?.syncContactWithWoocommerce(
            contact?.id,
            storeUrl,
            consumerKey,
            consumerSecret,
            'create',
          );
        } catch (error) {
          throw new Error(error);
        }
      } else if (store?.ecommerceType === 'magento') {
        const ecommerceContact = await strapi.db
          .query('api::ecommerce-contact-service.ecommerce-contact-service')
          .findOne({
            where: {
              contact: contact?.id,
              ecommerceType: 'magento',
              isSynced: true,
            },
          });

        if (ecommerceContact) {
          continue;
        }
        contactService?.syncContactWithMagento(
          contact?.id,
          storeUrl,
          accessToken,
          'create',
        );
      }
    }
  };
