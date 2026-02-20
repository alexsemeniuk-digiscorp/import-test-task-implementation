import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const syncClassWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result }: AfterLifecycleEvent) => {
    const classId = result?.id;
    const accountingService = await strapi.service(
      'api::acc-service-entity.acc-service-entity',
    );
    await accountingService.syncClassWithQuickBooks(classId);
    await accountingService.syncClassesWithXero(classId, operationName);
  };
