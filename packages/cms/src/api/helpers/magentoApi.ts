import axios from 'axios';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';

export const magentoApi = (storeUrl, accessToken) => {
  const magentoToken = encryptionService({ strapi }).decrypt(accessToken);
  const instance = axios.create({
    baseURL: `${storeUrl}/rest/V1`,
    headers: {
      'Authorization': `Bearer ${magentoToken.toString()}`,
      'Content-Type': 'application/json',
    },
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });

  return instance;
};
