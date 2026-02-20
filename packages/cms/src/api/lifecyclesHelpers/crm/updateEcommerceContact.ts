import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const updateEcommerceContact: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  const contact = await strapi.db.query('api::contact.contact').findOne({
    where: { id: result?.id },
    populate: ['tenant'],
  });

  const ecommerceStores = await strapi.db
    .query('api::ecommerce-detail.ecommerce-detail')
    .findMany({
      where: { tenant: contact?.tenant?.id },
    });

  if (ecommerceStores?.length === 0) {
    return null;
  }

  for (let index = 0; index < ecommerceStores.length; index++) {
    const store = ecommerceStores[index];
    const ecommerceContact = await strapi.db
      .query('api::ecommerce-contact-service.ecommerce-contact-service')
      .findOne({
        where: { contact: contact?.id, ecommerceType: store?.ecommerceType },
      });

    if (!ecommerceContact) {
      continue;
    }
    const storeUrl = store?.storeUrl;
    const accessToken = store?.accessToken;
    const consumerKey = store?.consumerKey;
    const consumerSecret = store?.consumerSecret;
    const contactService = strapi.service('api::contact.contact');

    if (store?.ecommerceType === 'shopify') {
      contactService?.syncContactWithShopify(
        contact?.id,
        storeUrl,
        accessToken,
        'update',
      );
    } else if (store?.ecommerceType === 'woocommerce') {
      contactService?.syncContactWithWoocommerce(
        contact?.id,
        storeUrl,
        consumerKey,
        consumerSecret,
        'update',
      );
    } else if (store?.ecommerceType === 'magento') {
      contactService?.syncContactWithMagento(
        contact?.id,
        storeUrl,
        accessToken,
        'update',
      );
    }
  }
};
