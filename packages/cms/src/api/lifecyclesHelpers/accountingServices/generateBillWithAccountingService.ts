import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const generateBillWithAccountingService: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  const orderId = result?.id;
  const billService = await strapi.service(
    'api::acc-service-bill.acc-service-bill',
  );
  if (result?.total == 0) {
    return;
  }
  if (result?.billDeletetion) {
    return;
  }
  if (!result?.billCreation) {
    return;
  }
  if (
    (result?.status == 'received' && result?.type == 'purchase') ||
    (result?.status == 'shipped' && result?.type == 'purchase')
  ) {
    await billService.syncBillWithXero(orderId);
    try {
      await billService.syncBillWithQuickBooks(orderId);
    } catch (error) {
      // Skip QuickBooks operation if auth expired, don't break the flow
      if (error.name === 'QuickBooksAuthExpiredError') {
        console.log(
          'QuickBooks auth expired, skipping bill generation in lifecycle hook',
        );
        return;
      }
      throw error; // Re-throw other errors
    }
  }
};
