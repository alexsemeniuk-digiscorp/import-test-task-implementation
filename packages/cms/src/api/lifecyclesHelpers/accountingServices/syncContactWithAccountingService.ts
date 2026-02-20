import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;
export const syncContactWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result, params }: AfterLifecycleEvent) => {
    // Skip sync contact with accounting service during bulk imports for performance
    if (params?.data?._skipSyncContactWithAccountingService) {
      delete params?.data?._skipSyncContactWithAccountingService;
      return;
    }

    const contactId = result?.id;
    const accountingContactService = await strapi.service(
      'api::acc-service-contact.acc-service-contact',
    );
    const accountingContactVendor = await strapi.service(
      'api::acc-service-vendor.acc-service-vendor',
    );
    const contact = await strapi.entityService.findOne(
      'api::contact.contact',
      contactId,
      {
        fields: ['id'],
        populate: {
          tenant: {
            fields: ['id'],
          },
        },
      },
    );
    try {
      await accountingContactService.syncContactWithQuickBooks(
        contactId,
        contact?.tenant?.id,
      );
      await accountingContactVendor.syncContactAsVendorWithQuickBooks(
        contactId,
        contact?.tenant?.id,
      );
    } catch (error) {
      // Skip QuickBooks operation if auth expired, don't break the flow
      if (error.name === 'QuickBooksAuthExpiredError') {
        console.log(
          'QuickBooks auth expired, skipping contact sync in lifecycle hook',
        );
        // Continue with Xero operation even if QuickBooks fails
        await accountingContactService.syncContactWithXero(
          contactId,
          operationName,
          contact?.tenant?.id,
        );
        return;
      }
      throw error; // Re-throw other errors
    }
    await accountingContactService.syncContactWithXero(
      contactId,
      operationName,
      contact?.tenant?.id,
    );
  };
