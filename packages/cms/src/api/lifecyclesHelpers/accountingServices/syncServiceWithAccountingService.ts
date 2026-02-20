import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const syncServiceWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result }: AfterLifecycleEvent) => {
    const serviceId = result?.id;
    const accountingService = await strapi.service(
      'api::acc-service-entity.acc-service-entity',
    );
    try {
      await accountingService.syncServiceWithQuickBooks(serviceId);
    } catch (error) {
      // Skip QuickBooks operation if auth expired, don't break the flow
      if (error.name === 'QuickBooksAuthExpiredError') {
        // Continue with Xero operation even if QuickBooks fails
        await accountingService.syncServiceWithXero(serviceId, operationName);
        return;
      }
      throw error; // Re-throw other errors
    }
    await accountingService.syncServiceWithXero(serviceId, operationName);
  };
