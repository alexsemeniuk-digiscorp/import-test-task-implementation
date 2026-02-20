import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const generateInvoiceWithAccountingService: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  const orderId = result?.id;
  const accountingService = await strapi.service(
    'api::acc-service-order.acc-service-order',
  );

  if (result?.total == 0) {
    return;
  }
  if (result?.billDeletetion) {
    return;
  }
  if (
    result?.status === 'shipped' &&
    result?.type != 'purchase' &&
    result?.type != 'tradeIn'
  ) {
    try {
      await accountingService.generateInoviceWithQuickBooks(orderId);
    } catch (error) {
      // Skip QuickBooks operation if auth expired, don't break the flow
      if (error.name === 'QuickBooksAuthExpiredError') {
        // Continue with Xero operation even if QuickBooks fails
        await accountingService.generateInoviceWithXero(orderId);
        return;
      }
      throw error; // Re-throw other errors
    }
    await accountingService.generateInoviceWithXero(orderId);
  }
};
