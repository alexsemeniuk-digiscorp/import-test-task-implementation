// eslint-disable-next-line @typescript-eslint/no-var-requires
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';

export const woocommerceApi = (shopUrl, consumerKey, consumerSecret) => {
  const woocommerceConsumerKey = encryptionService({ strapi }).decrypt(
    consumerKey,
  );
  const woocommerceConsumerSecret = encryptionService({ strapi }).decrypt(
    consumerSecret,
  );
  console.log('WooCommerce API called', shopUrl, consumerKey, consumerSecret);
  const woocommerceApi = new WooCommerceRestApi({
    url: shopUrl,
    consumerKey: woocommerceConsumerKey.toString(),
    consumerSecret: woocommerceConsumerSecret.toString(),
    version: 'wc/v3',
  });

  return woocommerceApi;
};
