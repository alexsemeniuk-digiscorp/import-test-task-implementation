import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const syncMembershipWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result }: AfterLifecycleEvent) => {
    const membershipId = result?.id;
    const accountingService = await strapi.service(
      'api::acc-service-entity.acc-service-entity',
    );
    await accountingService.syncMembershipWithQuickBooks(membershipId);
    await accountingService.syncMembershipsWithXero(
      membershipId,
      operationName,
    );
  };
