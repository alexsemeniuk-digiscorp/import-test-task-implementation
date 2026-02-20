import { AccountingserviceOperation, LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const syncDealTransactionWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result, params }: AfterLifecycleEvent) => {
    // Skip sync deal transaction with accounting during bulk imports for performance
    if (params?.data?._skipSyncDealTransactionWithAccounting) {
      delete params?.data?._skipSyncDealTransactionWithAccounting;
      return;
    }

    const dealTransactionId = result?.id;
    const accountingCompanyService = await strapi.service(
      'api::acc-service-txn.acc-service-txn',
    );
    const transaction = await strapi.entityService.findOne(
      'api::deal-transaction.deal-transaction',
      dealTransactionId,
      {
        fields: ['id', 'status'],
        populate: {
          chartAccount: {
            fields: ['id', 'type'],
          },
        },
      },
    );

    if (transaction?.status === 'Refunded') {
      try {
        await accountingCompanyService.syncRefundTransactionWithQuickBooks(
          dealTransactionId,
        );
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping refund transaction sync in lifecycle hook',
          );
          // Continue with Xero operation even if QuickBooks fails
          await accountingCompanyService.syncRefundWithXero(
            dealTransactionId,
            operationName,
          );
          return;
        }
        throw error; // Re-throw other errors
      }
      await accountingCompanyService.syncRefundWithXero(
        dealTransactionId,
        operationName,
      );
      return;
    }

    if (transaction?.chartAccount?.type == 'income') {
      try {
        await accountingCompanyService.syncDealTransactionWithQuickBooks(
          dealTransactionId,
        );
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping deal transaction sync in lifecycle hook',
          );
          // Continue with Xero operation even if QuickBooks fails
          await accountingCompanyService.syncDealTransactionWithXero(
            dealTransactionId,
            operationName,
          );
          return;
        }
        throw error; // Re-throw other errors
      }
      await accountingCompanyService.syncDealTransactionWithXero(
        dealTransactionId,
        operationName,
      );
    } else if (transaction?.chartAccount?.type == 'cost') {
      try {
        await accountingCompanyService.syncExpenseDealTransactionWithQuickBooks(
          dealTransactionId,
        );
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping expense transaction sync in lifecycle hook',
          );
          return;
        }
        throw error; // Re-throw other errors
      }
    }
  };
