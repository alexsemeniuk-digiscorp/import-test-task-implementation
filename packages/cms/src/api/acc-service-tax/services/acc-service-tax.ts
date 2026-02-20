/**
 * acc-service-tax service
 */

import { factories } from '@strapi/strapi';
import { handleError } from '../../../graphql/helpers/errors';
import { DEFAULT_TAX_AGENCY } from '../../helpers/constants';
import quickBookApi from '../../helpers/quickBooksApi';

export default factories.createCoreService(
  'api::acc-service-tax.acc-service-tax',
  ({ strapi }) => ({
    async findOrCreateTaxRate(
      taxPercentage: number,
      realmId: string,
      headers: {
        Authorization: string;
        accountingServiceId: string;
      },
    ) {
      try {
        const query = `SELECT * FROM TaxRate WHERE RateValue = '${taxPercentage}'`;
        const searchRes = await quickBookApi.get(
          `/${realmId}/query?query=${encodeURIComponent(query)}`,
          {
            headers,
          },
        );

        const existingRates = searchRes.data?.QueryResponse?.TaxRate || [];
        const taxService = await strapi.service(
          'api::acc-service-tax.acc-service-tax',
        );
        const taxRef = await taxService.findOrCreateTaxAgency(
          realmId,
          headers,
          DEFAULT_TAX_AGENCY,
        );

        if (existingRates.length > 0) {
          return existingRates[0]; // return existing tax rate
        }

        // Step 2: Create Tax Rate + Tax Code
        const rateName = `Custom Rate ${taxPercentage}%`;
        const taxRatePayload = {
          TaxRateDetails: [
            {
              RateValue: taxPercentage,
              TaxApplicableOn: 'Sales',
              TaxAgencyId: taxRef?.Id,
              TaxRateName: rateName,
            },
          ],
          TaxCode: rateName,
        };

        const createRes = await quickBookApi.post(
          `/${realmId}/taxservice/taxcode`,
          taxRatePayload,
          {
            headers,
          },
        );

        return createRes.data;
      } catch (error) {
        handleError(
          'findOrCreateTaxRate',
          'Failed to Create default taxes with Quick Books',
          error,
        );
      }
    },
    async findOrCreateTaxAgency(
      realmId: string,
      headers: {
        Authorization: string;
        accountingServiceId: string;
      },
      agencyName: string,
    ) {
      try {
        // 1. Get all agencies
        const query = `SELECT * FROM TaxAgency`;
        const response = await quickBookApi.get(
          `/${realmId}/query?query=${encodeURIComponent(query)}`,
          { headers },
        );

        const agencies = response.data?.QueryResponse?.TaxAgency || [];

        // 2. Match by DisplayName
        const existingAgency = agencies.find(
          (agency: { DisplayName: string }) =>
            agency.DisplayName?.toLowerCase() === agencyName.toLowerCase(),
        );

        if (existingAgency) {
          return existingAgency;
        }

        // 3. Create if not found
        const createRes = await quickBookApi.post(
          `/${realmId}/taxagency`,
          { DisplayName: agencyName },
          { headers },
        );

        return createRes.data.TaxAgency;
      } catch (error) {
        handleError(
          'findOrCreateTaxAgency',
          'Failed to find or create Tax Agency in QuickBooks',
          error,
        );
      }
    },
  }),
);
