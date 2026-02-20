import { GraphQLFieldResolver } from 'graphql';
import {
  ENTITY_PAGE_SIZE,
  QUICK_BOOKS_BATCH_COOL_TIME,
  QUICK_BOOKS_BATCH_SIZE,
} from '../../../constants';
import { AccountingServiceType } from '../../../helpers/types';

export const prevProductSyncWithAccountingService: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: { serviceType: AccountingServiceType; tenantId: number } }
> = async (root, { input }) => {
  try {
    const accountingProductAndService = await strapi.service(
      'api::acc-service-entity.acc-service-entity',
    );

    const accountingMappingService = await strapi.service(
      'api::acc-product-mapping.acc-product-mapping',
    );

    const mappingStatus = await accountingMappingService.defaultMappingStatus({
      entityType: 'product',
      tenantId: input.tenantId,
      serviceType: input.serviceType,
    });

    if (!mappingStatus) {
      throw new Error(`Please complete the ${input?.serviceType} mapping.`);
    }

    const PAGE_SIZE = ENTITY_PAGE_SIZE;
    let start = 0;
    let hasMore = true;

    while (hasMore) {
      const productsPage = await strapi.entityService.findMany(
        'api::product.product',
        {
          filters: {
            tenant: {
              id: {
                $eq: input?.tenantId,
              },
            },
          },
          populate: [
            'accServiceEntities',
            'accServiceEntities.accServiceConn',
            'revenueChartAccount',
            'revenueChartAccount.accProductMappings',
            'revenueChartCategory',
            'revenueChartCategory.accProductMappings',
            'revenueChartSubcategory',
            'revenueChartSubcategory.accProductMappings',
            'costChartAccount',
            'costChartAccount.accProductMappings',
            'costChartCategory',
            'costChartCategory.accProductMappings',
            'costChartSubcategory',
            'costChartSubcategory.accProductMappings',
            'productInventoryItems',
          ],
          start,
          limit: PAGE_SIZE,
        },
      );

      if (!productsPage.length) {
        hasMore = false;
        break;
      }

      if (input.serviceType === 'quickBooks') {
        for (let i = 0; i < productsPage.length; i += QUICK_BOOKS_BATCH_SIZE) {
          const batch = productsPage.slice(i, i + QUICK_BOOKS_BATCH_SIZE);
          await accountingProductAndService.syncBatchProductWithQuickBooks(
            batch,
            input.tenantId,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, QUICK_BOOKS_BATCH_COOL_TIME),
          );
        }
      } else if (input.serviceType === 'xero') {
        await accountingProductAndService.syncBatchProductWithXero(
          productsPage,
          input.tenantId,
        );
      }

      start += PAGE_SIZE;
    }

    return true;
  } catch (error) {
    throw new Error(error.message || 'Failed to sync products');
  }
};
