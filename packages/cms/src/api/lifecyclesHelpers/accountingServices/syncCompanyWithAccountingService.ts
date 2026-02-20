import { AccountingserviceOperation, LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;
export const syncCompanyWithAccountingService =
  (operationName: AccountingserviceOperation): LifecycleHook =>
  async ({ result, params }: AfterLifecycleEvent) => {
    // Skip check is email unique during bulk imports for performance
    if (params?.data?._skipSyncCompanyWithAccountingService) {
      delete params?.data?._skipSyncCompanyWithAccountingService;
      return;
    }

    const companyId = result?.id;
    const accountingCompanyService = await strapi.service(
      'api::acc-service-vendor.acc-service-vendor',
    );
    const accountingContactService = await strapi.service(
      'api::acc-service-contact.acc-service-contact',
    );
    const company = await strapi.entityService.findOne(
      'api::company.company',
      companyId,
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
      await accountingCompanyService.syncCompanyAsVendorWithQuickBooks(
        companyId,
        company?.tenant?.id,
      );
      await accountingContactService.syncCompanyAsContactWithQuickBooks(
        companyId,
        company?.tenant?.id,
      );
    } catch (error) {
      // Skip QuickBooks operation if auth expired, don't break the flow
      if (error.name === 'QuickBooksAuthExpiredError') {
        console.log(
          'QuickBooks auth expired, skipping company sync in lifecycle hook',
        );
        // Continue with Xero operation even if QuickBooks fails
        await accountingContactService.syncContactAsSupplierWithXero(
          companyId,
          operationName,
          company?.tenant?.id,
        );
        await accountingContactService.syncContactWithXero(
          companyId,
          operationName,
          company?.tenant?.id,
        );
        return;
      }
      throw error; // Re-throw other errors
    }
    await accountingContactService.syncContactAsSupplierWithXero(
      companyId,
      operationName,
      company?.tenant?.id,
    );
    await accountingContactService.syncContactWithXero(
      companyId,
      operationName,
      company?.tenant?.id,
    );
  };
