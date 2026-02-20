import { GraphQLFieldResolver } from 'graphql';
import {
  ENTITY_PAGE_SIZE,
  QUICK_BOOKS_BATCH_COOL_TIME,
  QUICK_BOOKS_BATCH_SIZE_CONTACTS,
} from '../../../constants';
import { AccountingServiceType } from '../../../helpers/types';

export const prevContactSyncWithAccountingService: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: { tenantId: number; serviceType: AccountingServiceType } }
> = async (root, { input }) => {
  try {
    const accountingContactService = await strapi.service(
      'api::acc-service-contact.acc-service-contact',
    );
    const accountingVendorService = await strapi.service(
      'api::acc-service-vendor.acc-service-vendor',
    );

    const BATCH_SIZE = QUICK_BOOKS_BATCH_SIZE_CONTACTS;
    const PAGE_SIZE = ENTITY_PAGE_SIZE;

    // Paginate contacts
    let contactStart = 0;
    let hasMoreContacts = true;

    while (hasMoreContacts) {
      const contacts = await strapi.entityService.findMany(
        'api::contact.contact',
        {
          filters: {
            tenant: {
              id: {
                $eq: input?.tenantId,
              },
            },
          },
          populate: ['accServiceContacts'],
          start: contactStart,
          limit: PAGE_SIZE,
        },
      );

      if (!contacts.length) {
        hasMoreContacts = false;
        break;
      }

      if (input?.serviceType === 'quickBooks') {
        for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
          const batch = contacts.slice(i, i + BATCH_SIZE);
          await accountingContactService.syncBatchContactWithQuickBooks(
            batch,
            input.tenantId,
          );
          await accountingVendorService.syncBatchContactAsVendorWithQuickBooks(
            batch,
            input.tenantId,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, QUICK_BOOKS_BATCH_COOL_TIME),
          );
        }
      } else if (input?.serviceType === 'xero') {
        await accountingContactService.syncBatchContactWithXero(contacts);
      }

      contactStart += PAGE_SIZE;
    }

    // Paginate companies
    let companyStart = 0;
    let hasMoreCompanies = true;

    while (hasMoreCompanies) {
      const companies = await strapi.entityService.findMany(
        'api::company.company',
        {
          filters: {
            tenant: {
              id: {
                $eq: input?.tenantId,
              },
            },
          },
          start: companyStart,
          limit: PAGE_SIZE,
        },
      );

      if (!companies.length) {
        hasMoreCompanies = false;
        break;
      }

      if (input?.serviceType === 'quickBooks') {
        for (let i = 0; i < companies.length; i += BATCH_SIZE) {
          const batch = companies.slice(i, i + BATCH_SIZE);
          await accountingVendorService.syncBatchCompanyAsVendorWithQuickBooks(
            batch,
            input.tenantId,
          );
          await accountingContactService.syncBatchCompanyAsCustomerWithQuickBooks(
            batch,
            input.tenantId,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, QUICK_BOOKS_BATCH_COOL_TIME),
          );
        }
      } else if (input?.serviceType === 'xero') {
        await accountingContactService.syncBatchContactAsSupplierWithXero(
          companies,
        );
        await accountingContactService.syncBatchCompanyWithXero(companies);
      }

      companyStart += PAGE_SIZE;
    }

    return true;
  } catch (error) {
    throw new Error(error.message || 'Failed to sync contacts/companies');
  }
};
