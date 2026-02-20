import axios from 'axios';
import { handleLogger } from '../../graphql/helpers/errors';
import { ServiceJsonType } from '../lifecyclesHelpers/types';

// initialize axios
const xeroApi = axios.create({
  baseURL: `${process.env.XERO_BASE_URL}/api.xro/2.0`,
  headers: {
    Accept: 'application/json',
  },
});

// interceptor for refresh token
xeroApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    handleLogger('warn', 'Xero Interceptor', null, err);
    if (err?.response?.status === 401) {
      //accountingServiceId from header
      const accountingServiceId = err.config.headers['accountingServiceId'];

      const xeroService = await strapi.service(
        'api::acc-service-conn.acc-service-conn',
      );
      const accountingServiceData = await strapi.entityService.findOne(
        'api::acc-service-conn.acc-service-conn',
        accountingServiceId,
        {
          populate: ['businessLocation'],
        },
      );

      //Attempt to refresh the token
      const serviceJson = accountingServiceData?.serviceJson as ServiceJsonType;
      const newAccessToken = await xeroService.refreshXeroToken(
        process.env.XERO_CLIENT_ID,
        process.env.XERO_CLIENT_SECRET,
        serviceJson?.refreshToken,
        accountingServiceData?.businessLocation?.id,
      );
      // Update the original request with the new access token
      err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

      // Retry the original request
      return xeroApi.request(err.config);
    }
    return Promise.reject(err);
  },
);

export default xeroApi;
