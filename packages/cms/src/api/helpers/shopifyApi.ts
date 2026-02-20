import axios from 'axios';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';

export const shopifyApi = (shopUrl, accessToken) => {
  console.log('Shopify API called', shopUrl, accessToken);
  const shopifyToken = encryptionService({ strapi }).decrypt(accessToken);

  const instance = axios.create({
    baseURL: `https://${shopUrl}`,
    headers: {
      'X-Shopify-Access-Token': shopifyToken?.toString(),
      'Content-Type': 'application/json',
    },
  });

  return instance;
};
