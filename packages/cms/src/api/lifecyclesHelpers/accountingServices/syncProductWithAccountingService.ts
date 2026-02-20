import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const syncProductWithAccountingServices =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result, params }: AfterLifecycleEvent) => {
    // Skip accounting sync during bulk imports for performance
    if (params?.data?._skipAccountingSync) {
      delete params?.data?._skipAccountingSync;
      return;
    }

    const productId = result?.id;
    const accountingService = await strapi.service(
      'api::acc-service-entity.acc-service-entity',
    );
    const accountingServices = await strapi.entityService.findMany(
      'api::acc-service-conn.acc-service-conn',
      {
        filters: {
          serviceType: { $eq: 'quickBooks' },
          tenant: { id: { $eq: params?.data?.tenant } },
        },
        fields: ['id', 'isProductNotSynced'],
      },
    );
    if (!accountingServices?.[0]?.isProductNotSynced) {
      await accountingService.syncProductWithQuickBooks(productId);
    }
    await accountingService.syncProductWithXero(productId, operationName);
  };
