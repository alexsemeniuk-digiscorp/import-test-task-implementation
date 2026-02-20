import axios from 'axios';
import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { handleLogger } from '../../graphql/helpers/errors';
import { ServiceJsonType } from '../lifecyclesHelpers/types';

// initialize axios
const quickBookApi = axios.create({
  baseURL: `${process.env.QB_WEBSITE_QBO_BASE_URL}/v3/company`,
  headers: { 'Content-Type': 'application/json' },
});

// interceptor for refresh token
quickBookApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    handleLogger('warn', 'Quick Books Interceptor', null, err);
    if (err?.response?.status === 401 && !err?.config?.__qbRetry) {
      //accountingServiceId from header
      const accountingServiceId = err.config.headers['accountingServiceId'];

      const quickBooksService = await strapi.service(
        'api::acc-service-conn.acc-service-conn',
      );
      const accountingServiceData = await strapi.entityService.findOne(
        'api::acc-service-conn.acc-service-conn',
        accountingServiceId,
        {
          populate: ['businessLocation'],
        },
      );

      //Attempt to refresh the token once
      const serviceJson = accountingServiceData?.serviceJson as ServiceJsonType;
      const clientId = await encryptionService({ strapi }).decrypt(
        serviceJson?.clientId,
      );
      const clientSecret = await encryptionService({ strapi }).decrypt(
        serviceJson?.clientSecret,
      );
      try {
        const newAccessToken = await quickBooksService.refreshQuickBooksToken(
          clientId,
          clientSecret,
          serviceJson?.refreshToken,
          accountingServiceData.businessLocation.id,
        );
        if (newAccessToken) {
          err.config.__qbRetry = true;
          err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return quickBookApi.request(err.config);
        }
      } catch (_e) {
        // ignore and fall back to background rotation
      }

      // Schedule background rotation so future requests recover automatically
      try {
        await quickBooksService.rotateQuickBooksTokensInBackground(
          accountingServiceId,
        );
      } catch (_scheduleErr) {
        // intentionally ignored
      }

      // Return a clear message without throwing to avoid breaking flow
      if (err.response) {
        err.response.data = err.response.data || {};
        err.response.data.message =
          'QuickBooks auth expired. Please reconnect your QuickBooks account.';
        return err.response;
      }
      return {
        data: {
          message:
            'QuickBooks auth expired. Please reconnect your QuickBooks account.',
        },
      } as any;
    }
    return Promise.reject(err.message);
  },
);

export default quickBookApi;
