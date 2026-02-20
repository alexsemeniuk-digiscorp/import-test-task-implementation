/**
 * acc-product-mapping service
 */

import { factories } from '@strapi/strapi';
import { handleError } from '../../../graphql/helpers/errors';
import { ServiceJsonType } from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-product-mapping.acc-product-mapping',
  ({ strapi }) => ({
    async defaultMappingStatus(params) {
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              tenant: { id: params.tenantId },
              serviceType: params.serviceType,
            },
          },
        );

        const connectedServices = accountingServices.filter(
          (service) => (service.serviceJson as ServiceJsonType).realmId,
        );
        if (!connectedServices?.length) {
          return new Error(`Please connect the ${params.serviceType}.`);
        }

        for (const accountingService of connectedServices) {
          const {
            prePaymentService,
            inventoryAsset,
            defaultRevenue,
            defaultCost,
            refundAccount,
            refundService,
            depositToAccount,
            billPaymentAccount,
            prePaymentAccountPurchase,
            prePaymentServicePurchase,
            defaultPaymentMethod,
          } = accountingService.serviceJson as ServiceJsonType;

          switch (params.entityType) {
            case 'product':
              if (!(defaultCost && inventoryAsset && defaultRevenue)) {
                return false;
              }
              break;
            case 'service':
              if (!(defaultCost && defaultRevenue)) {
                return false;
              }
              break;
            case 'purchaseOrder':
              if (
                !(
                  billPaymentAccount &&
                  prePaymentAccountPurchase &&
                  prePaymentServicePurchase &&
                  defaultPaymentMethod
                )
              ) {
                return false;
              }
              break;
            case 'sellOrder':
              if (
                !(
                  prePaymentService &&
                  inventoryAsset &&
                  defaultRevenue &&
                  defaultCost &&
                  refundAccount &&
                  refundService &&
                  depositToAccount
                )
              ) {
                return false;
              }
              break;
            default:
              throw new Error(`Unsupported entityType: ${params.entityType}`);
          }
        }

        return true;
      } catch (error) {
        handleError(
          'defaultMappingStatus',
          'Failed to fetch defaultMappingStatus',
          error,
        );
      }
    },
  }),
);
