/**
 * acc-service-contact service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleError } from '../../../graphql/helpers/errors';
import quickBookApi from '../../helpers/quickBooksApi';
import xeroApi from '../../helpers/xeroApi';
import {
  AccountingserviceOperation,
  ServiceJsonType,
} from '../../lifecyclesHelpers/types';

type ContactData = {
  Contacts: {
    Name: string;
    EmailAddress: string;
    Phones?: { PhoneType: string; PhoneNumber: string }[];
    Addresses: { AddressType: string; AddressLine1: string }[];
    IsCustomer: boolean;
    ContactID?: string;
  }[];
};

export default factories.createCoreService(
  'api::acc-service-contact.acc-service-contact',
  ({ strapi }) => ({
    async syncContactWithQuickBooks(contactId: ID, tenantId: ID) {
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            populate: ['businessLocation'],
            filters: {
              serviceType: { $eq: 'quickBooks' },
              tenant: { id: { $eq: tenantId } },
            },
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        const isContactNotSynced =
          accountingServices?.[0]?.serviceJson?.isContactNotSynced;
        if (isContactNotSynced) {
          return;
        }
        //getting all the updated values
        const contact = await strapi.entityService.findOne(
          'api::contact.contact',
          contactId,
          {
            populate: [
              'company',
              'accServiceContacts',
              'accServiceContacts.accServiceConn',
            ],
          },
        );
        const syncedRealmIds: string[] = [];
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            let quickBookCustomer;
            const data = {
              FullyQualifiedName: contact?.fullName,
              PrimaryEmailAddr: {
                Address: contact?.email,
              },
              DisplayName: contact?.fullName,
              PrimaryPhone: {
                FreeFormNumber: contact?.phoneNumber,
              },
              CompanyName: contact?.company?.name,
              BillAddr: {
                Line1: contact?.address || 'No Address',
              },
              GivenName: contact?.fullName,
            };
            if (!contact?.company?.name) {
              delete data.CompanyName;
            }
            let accountingServiceId: ID;
            const accServiceContact = await strapi.db
              .query('api::acc-service-contact.acc-service-contact')
              .findOne({
                where: {
                  contact: contactId,
                  serviceType: 'quickBooks',
                  businessLocation: service.businessLocation.id,
                },
              });
            if (accServiceContact) {
              data['Id'] = accServiceContact?.accountingServiceId;
              data['SyncToken'] = accServiceContact?.syncToken;
              accountingServiceId = accServiceContact?.id;
            }
            if (!syncedRealmIds.includes(serviceJson.realmId)) {
              syncedRealmIds.push(serviceJson.realmId);

              try {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };
                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/customer`,
                  data,
                  { headers },
                );
                quickBookCustomer = await response.data.Customer;
              } catch (error) {
                handleError(
                  'syncContactWithQuickBooks',
                  'Failed to create contact in Quick Books',
                  error,
                );
              }
            }
            const updatedAccountingServiceProduct =
              await strapi.entityService.findOne(
                'api::contact.contact',
                contactId,
                {
                  populate: [
                    'accServiceContacts',
                    'accServiceContacts.accServiceConn',
                  ],
                },
              );
            const oldContact =
              await updatedAccountingServiceProduct?.accServiceContacts?.map(
                (accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson?.realmId
                    ? accService
                    : null,
              );
            if (accServiceContact?.id && quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-contact.acc-service-contact',
                accountingServiceId,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: quickBookCustomer.SyncToken,
                  },
                },
              );
            } else if (
              serviceJson.realmId &&
              !accServiceContact?.id &&
              oldContact[0]?.accountingServiceId
            ) {
              await strapi.entityService.create(
                'api::acc-service-contact.acc-service-contact',
                {
                  data: {
                    contact: contactId,
                    accountingServiceId: oldContact[0].accountingServiceId,
                    businessLocation: service.businessLocation.id,
                    syncToken: oldContact[0].syncToken,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'quickBooks',
                    accServiceConn: service.id,
                  },
                },
              );
            } else if (accServiceContact?.id && !quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-contact.acc-service-contact',
                accountingServiceId,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: oldContact[0].syncToken,
                  },
                },
              );
            } else {
              if (quickBookCustomer) {
                await strapi.entityService.create(
                  'api::acc-service-contact.acc-service-contact',
                  {
                    data: {
                      contact: contactId,
                      accountingServiceId: quickBookCustomer?.Id,
                      businessLocation: service.businessLocation.id,
                      syncToken: quickBookCustomer.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncContactWithQuickBooks',
          'Failed to create contact in Quick Books -2',
          error,
        );
      }
    },
    async syncContactWithXero(
      contactId: ID,
      operationName: AccountingserviceOperation,
      tenantId: ID,
    ) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          populate: ['company', 'accServiceContacts'],
        },
      );

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingContactService = await strapi.db
          .query('api::acc-service-contact.acc-service-contact')
          .findOne({
            where: {
              contact: contact?.id,
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });
        if (operationName === 'update' && !accountingContactService) {
          continue;
        }

        const contactData: ContactData = {
          Contacts: [
            {
              Name: contact?.fullName,
              EmailAddress: contact?.email,
              Phones: [
                {
                  PhoneType: 'MOBILE',
                  PhoneNumber: contact?.phoneNumber,
                },
              ],
              Addresses: [
                {
                  AddressType: 'STREET',
                  AddressLine1: contact?.address,
                },
              ],
              IsCustomer: true,
            },
          ],
        };

        const headers = {
          'Authorization': `Bearer ${accountingServices[index]?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingServices[index]?.id,
          'Xero-Tenant-Id':
            accountingServices[index]?.serviceJson?.xeroTenantId,
        };

        try {
          if (operationName === 'update' && accountingContactService) {
            contactData.Contacts[0].ContactID =
              accountingContactService.accountingServiceId;
            await xeroApi.post(`/Contacts`, contactData, { headers });
          } else {
            const response = await xeroApi.post(`/Contacts`, contactData, {
              headers,
            });

            if (response) {
              await strapi.entityService.create(
                'api::acc-service-contact.acc-service-contact',
                {
                  data: {
                    contact: contactId,
                    accountingServiceId: response?.data?.Contacts[0]?.ContactID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'xero',
                    accServiceConn: accountingServices[index]?.id,
                  },
                },
              );
            }
          }
        } catch (error) {
          handleError(
            'syncContactWithXero',
            'Failed to create contact in Xero',
            error,
          );
        }
      }
    },
    async syncBatchContactWithXero(contacts, tenantId: ID) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (
        let serviceIndex = 0;
        serviceIndex < accountingServices?.length;
        serviceIndex++
      ) {
        const service = accountingServices[serviceIndex];
        const newContactArray = [];

        for (const contact of contacts) {
          const accountingContactService = await strapi.db
            .query('api::acc-service-contact.acc-service-contact')
            .findOne({
              where: {
                contact: contact?.id,
                businessLocation: service?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingContactService) {
            newContactArray.push(contact);
          }
        }

        const headers = {
          'Authorization': `Bearer ${service?.serviceJson?.accessToken}`,
          'accountingServiceId': service?.id,
          'Xero-Tenant-Id': service?.serviceJson?.xeroTenantId,
        };

        // Divide the contacts into batches of 50
        for (let i = 0; i < newContactArray.length; i += 50) {
          const batchedContacts = newContactArray
            .slice(i, i + 50)
            .map((contact) => {
              const contactData = {
                Name: contact?.fullName,
                EmailAddress: contact?.email,
                Phones: [
                  {
                    PhoneType: 'MOBILE',
                    PhoneNumber: contact?.phoneNumber,
                  },
                ],
                Addresses: [
                  {
                    AddressType: 'STREET',
                    AddressLine1: contact?.address,
                  },
                ],
                IsCustomer: true,
              };

              return contactData;
            });

          const payload = { Contacts: batchedContacts };

          try {
            if (payload?.Contacts?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Contacts`, payload, {
              headers,
            });

            if (response) {
              const createdContacts = response?.data?.Contacts || [];
              for (const createdContact of createdContacts) {
                const matchedContact = newContactArray.find(
                  (c) => c.email === createdContact?.EmailAddress,
                );
                if (matchedContact) {
                  await strapi.entityService.create(
                    'api::acc-service-contact.acc-service-contact',
                    {
                      data: {
                        contact: matchedContact.id,
                        accountingServiceId: createdContact?.ContactID,
                        businessLocation: service?.businessLocation?.id,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'xero',
                        accServiceConn: service?.id,
                      },
                    },
                  );
                }
              }
            }
          } catch (error) {
            handleError(
              'syncBatchContactWithXero',
              'Failed to Batch sync contacts with Xero',
              error,
            );
          }
        }
      }
    },
    async syncContactAsSupplierWithXero(
      contactId: ID,
      operationName: AccountingserviceOperation,
      tenantId: ID,
    ) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );
      if (!accountingServices?.length) {
        return;
      }

      const company = await strapi.entityService.findOne(
        'api::company.company',
        contactId,
        {
          populate: ['accServiceVendors'],
        },
      );

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingCompanyService = await strapi.db
          .query('api::acc-service-vendor.acc-service-vendor')
          .findOne({
            where: {
              company: company?.id,
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });

        const companyData = {
          Contacts: [
            {
              Name: company?.name,
              EmailAddress: company?.email,
              Phones: [
                {
                  PhoneType: 'MOBILE',
                  PhoneNumber: company?.phoneNumber,
                },
              ],
              Addresses: [
                {
                  AddressType: 'STREET',
                  AddressLine1: company?.address,
                },
              ],
            },
          ],
        };

        const headers = {
          'Authorization': `Bearer ${accountingServices[index]?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingServices[index]?.id,
          'Xero-Tenant-Id':
            accountingServices[index]?.serviceJson?.xeroTenantId,
        };

        try {
          let response;
          if (
            operationName === 'update' &&
            accountingCompanyService?.accountingServiceId
          ) {
            companyData.Contacts[0]['ContactID'] =
              accountingCompanyService.accountingServiceId;
            response = await xeroApi.post(`/Contacts`, companyData, {
              headers,
            });
          } else if (!accountingCompanyService) {
            response = await xeroApi.post(`/Contacts`, companyData, {
              headers,
            });

            if (response) {
              await strapi.entityService.create(
                'api::acc-service-vendor.acc-service-vendor',
                {
                  data: {
                    company: company?.id,
                    accountingServiceId: response?.data?.Contacts[0]?.ContactID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'xero',
                    syncToken: '0',
                    accServiceConn: accountingServices[index]?.id,
                  },
                },
              );
            }
          }
        } catch (error) {
          handleError(
            'syncContactAsSupplierWithXero',
            'Failed to Contact sync contacts with Xero',
            error,
          );
        }
      }
    },
    async syncBatchContactAsSupplierWithXero(companies, tenantId: ID) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (
        let serviceIndex = 0;
        serviceIndex < accountingServices?.length;
        serviceIndex++
      ) {
        const service = accountingServices[serviceIndex];
        const newComapniesArray = [];

        for (const company of companies) {
          const accountingCompanyService = await strapi.db
            .query('api::acc-service-vendor.acc-service-vendor')
            .findOne({
              where: {
                company: company?.id,
                businessLocation: service?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingCompanyService) {
            newComapniesArray.push(company);
          }
        }

        const headers = {
          'Authorization': `Bearer ${service?.serviceJson?.accessToken}`,
          'accountingServiceId': service?.id,
          'Xero-Tenant-Id': service?.serviceJson?.xeroTenantId,
        };

        // Divide the companies into batches of 50
        for (let i = 0; i < newComapniesArray.length; i += 50) {
          const batchedCompanies = newComapniesArray
            .slice(i, i + 50)
            .map((company) => {
              const companyData = {
                Name: company?.name,
                EmailAddress: company?.email,
                Phones: [
                  {
                    PhoneType: 'MOBILE',
                    PhoneNumber: company?.phoneNumber,
                  },
                ],
                Addresses: [
                  {
                    AddressType: 'STREET',
                    AddressLine1: company?.address,
                  },
                ],
              };

              return companyData;
            });

          const payload = { Contacts: batchedCompanies };

          try {
            if (payload?.Contacts?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Contacts`, payload, {
              headers,
            });

            if (response) {
              const createdContacts = response?.data?.Contacts || [];
              for (const createdContact of createdContacts) {
                const matchedContact = newComapniesArray.find(
                  (c) => c.email === createdContact?.EmailAddress,
                );
                if (matchedContact) {
                  await strapi.entityService.create(
                    'api::acc-service-vendor.acc-service-vendor',
                    {
                      data: {
                        company: matchedContact.id,
                        accountingServiceId: createdContact?.ContactID,
                        businessLocation: service?.businessLocation?.id,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'xero',
                        syncToken: '0',
                        accServiceConn: service?.id,
                      },
                    },
                  );
                }
              }
            }
          } catch (error) {
            handleError(
              'syncBatchContactAsSupplierWithXero',
              'Failed to Batch sync contacts with Xero',
              error,
            );
          }
        }
      }
    },
    async syncBatchContactWithQuickBooks(contacts, tenantId) {
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: { $eq: 'quickBooks' },
              tenant: { id: { $eq: tenantId } },
            },
            populate: [
              'businessLocation',
              'tenant.accServiceTrack',
              'accProductMappings',
              'accProductMappings.chartAccount',
              'accProductMappings.chartCategory',
              'accProductMappings.chartSubcategory',
              'tenant',
            ],
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        const isContactNotSynced =
          accountingServices?.[0]?.serviceJson?.isContactNotSynced;
        if (isContactNotSynced) {
          return;
        }
        const syncedRealmIds: Set<string> = new Set();
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            const newContactsArray = [];

            for (const contact of contacts) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-contact.acc-service-contact')
                .findOne({
                  where: {
                    contact: contact?.id,
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::contact.contact',
                  contact?.id,
                  {
                    populate: [
                      'company',
                      'tenant',
                      'accServiceContacts.accServiceConn',
                    ],
                  },
                );
                const oldContact = item?.accServiceContacts?.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson.realmId
                      ? accService
                      : null,
                );
                (item.oldContactServiceId = oldContact[0]?.accountingServiceId),
                  (item.syncToken = oldContact[0]?.syncToken);
                newContactsArray.push(item);
              }
            }

            if (!newContactsArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newContactsArray.map(async (contact) => {
                  if (contact?.oldContactServiceId) return null;
                  return {
                    bId: contact?.id,
                    Customer: {
                      FullyQualifiedName: contact?.fullName,
                      PrimaryEmailAddr: { Address: contact?.email },
                      DisplayName: contact?.fullName,
                      PrimaryPhone: { FreeFormNumber: contact?.phoneNumber },
                      CompanyName: contact?.company?.name,
                      BillAddr: { Line1: contact?.address || 'No Address' },
                      GivenName: contact?.fullName,
                      Notes: contact?.id,
                    },
                    operation: 'create',
                  };
                }),
              );

              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const contactData = {
                BatchItemRequest: cleanedBatchItems,
              };
              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  contactData,
                  { headers },
                );
                const quickBookCustomer = response.data.BatchItemResponse;

                if (quickBookCustomer) {
                  for (const contact of newContactsArray) {
                    const matchedCustomer = quickBookCustomer.find(
                      (qbProduct) => qbProduct?.Customer?.Notes == contact.id,
                    );
                    if (!matchedCustomer?.Customer?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-contact.acc-service-contact',
                      {
                        data: {
                          contact: contact.id,
                          accountingServiceId: matchedCustomer?.Customer?.Id,
                          businessLocation: service.businessLocation.id,
                          syncToken: matchedCustomer?.Customer?.SyncToken,
                          isSynced: true,
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const contact of newContactsArray) {
                  await strapi.entityService.create(
                    'api::acc-service-contact.acc-service-contact',
                    {
                      data: {
                        contact: contact.id,
                        accountingServiceId: contact?.oldContactServiceId,
                        businessLocation: service.businessLocation.id,
                        syncToken: contact?.syncToken,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const contact of newContactsArray) {
                const updatedContact = await strapi.entityService.findOne(
                  'api::contact.contact',
                  contact.id,
                  {
                    populate: [
                      'company',
                      'accServiceContacts',
                      'accServiceContacts.accServiceConn',
                    ],
                  },
                );

                if (!updatedContact?.accServiceContacts?.length) continue;

                const oldCustomer =
                  await updatedContact?.accServiceContacts?.filter(
                    (accService) =>
                      accService?.accServiceConn?.serviceJson?.realmId ===
                      serviceJson?.realmId,
                  );

                await strapi.entityService.create(
                  'api::acc-service-contact.acc-service-contact',
                  {
                    data: {
                      contact: contact.id,
                      accountingServiceId: oldCustomer[0].accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldCustomer[0].syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchContactWithQuickBooks',
          'Failed to Batch sync contacts with Quick Books',
          error,
        );
      }
    },
    async syncCompanyAsContactWithQuickBooks(companyId: ID, tenantId: ID) {
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            populate: ['businessLocation'],
            filters: {
              serviceType: { $eq: 'quickBooks' },
              tenant: { id: { $eq: tenantId } },
            },
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        //getting all the updated values
        const company = await strapi.entityService.findOne(
          'api::company.company',
          companyId,
          {
            populate: [
              'accServiceContacts',
              'accServiceContacts.accServiceConn',
            ],
          },
        );
        const syncedRealmIds: string[] = [];
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            let quickBookCustomer;
            const data = {
              FullyQualifiedName: company?.name,
              PrimaryEmailAddr: {
                Address: company?.email,
              },
              DisplayName: company?.name,
              CompanyName: company?.name,
              BillAddr: {
                Line1: company?.address || 'No Address',
              },
              GivenName: company?.name,
            };
            if (!company?.name) {
              delete data.CompanyName;
            }
            let accountingServiceId: ID;
            const accServiceContact = await strapi.db
              .query('api::acc-service-contact.acc-service-contact')
              .findOne({
                where: {
                  company: companyId,
                  serviceType: 'quickBooks',
                  businessLocation: service.businessLocation.id,
                },
              });
            if (accServiceContact) {
              data['Id'] = accServiceContact?.accountingServiceId;
              data['SyncToken'] = accServiceContact?.syncToken;
              accountingServiceId = accServiceContact?.id;
            }
            if (!syncedRealmIds.includes(serviceJson.realmId)) {
              syncedRealmIds.push(serviceJson.realmId);

              try {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/customer`,
                  data,
                  { headers },
                );
                quickBookCustomer = await response.data.Customer;
              } catch (error) {
                handleError(
                  'syncCompanyAsContactWithQuickBooks',
                  'Failed to sync Company with Quick Books',
                  error,
                );
              }
            }
            const updatedAccountingServiceProduct =
              await strapi.entityService.findOne(
                'api::company.company',
                companyId,
                {
                  populate: [
                    'accServiceContacts',
                    'accServiceContacts.accServiceConn',
                  ],
                },
              );
            const oldCompany =
              await updatedAccountingServiceProduct?.accServiceContacts?.map(
                (accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson?.realmId
                    ? accService
                    : null,
              );
            if (accServiceContact?.id && quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-contact.acc-service-contact',
                accountingServiceId,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: quickBookCustomer.SyncToken,
                  },
                },
              );
            } else if (
              serviceJson.realmId &&
              !accServiceContact?.id &&
              oldCompany[0]?.accountingServiceId
            ) {
              await strapi.entityService.create(
                'api::acc-service-contact.acc-service-contact',
                {
                  data: {
                    company: companyId,
                    accountingServiceId: oldCompany[0].accountingServiceId,
                    businessLocation: service.businessLocation.id,
                    syncToken: oldCompany[0].syncToken,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'quickBooks',
                    accServiceConn: service.id,
                  },
                },
              );
            } else if (accServiceContact?.id && !quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-contact.acc-service-contact',
                accountingServiceId,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: oldCompany[0].syncToken,
                  },
                },
              );
            } else {
              if (quickBookCustomer) {
                await strapi.entityService.create(
                  'api::acc-service-contact.acc-service-contact',
                  {
                    data: {
                      company: companyId,
                      accountingServiceId: quickBookCustomer?.Id,
                      businessLocation: service.businessLocation.id,
                      syncToken: quickBookCustomer.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncCompanyAsContactWithQuickBooks',
          'Failed to sync Company with Quick Books -2',
          error,
        );
      }
    },
    async syncBatchCompanyAsCustomerWithQuickBooks(companies, tenantId: ID) {
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: { $eq: 'quickBooks' },
              tenant: { id: { $eq: tenantId } },
            },
            populate: [
              'businessLocation',
              'tenant.accServiceTrack',
              'accProductMappings',
              'accProductMappings.chartAccount',
              'accProductMappings.chartCategory',
              'accProductMappings.chartSubcategory',
              'tenant',
            ],
          },
        );

        if (!accountingServices?.length) {
          return;
        }
        const isContactNotSynced =
          accountingServices?.[0]?.serviceJson?.isContactNotSynced;
        if (isContactNotSynced) {
          return;
        }
        const syncedRealmIds: Set<string> = new Set();
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            const newCompanyArray = [];

            for (const company of companies) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-contact.acc-service-contact')
                .findOne({
                  where: {
                    company: company?.id,
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::company.company',
                  company?.id,
                  {
                    populate: [
                      'company',
                      'tenant',
                      'accServiceContacts.accServiceConn',
                    ],
                  },
                );
                const oldCompany = item?.accServiceContacts?.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson.realmId
                      ? accService
                      : null,
                );
                item.oldCompanyServiceId = oldCompany[0]?.accountingServiceId;
                item.syncToken = oldCompany[0]?.syncToken;
                newCompanyArray.push(item);
              }
            }

            if (!newCompanyArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newCompanyArray.map(async (company, index) => {
                  if (company?.oldCompanyServiceId) return null;
                  return {
                    bId: index,
                    Customer: {
                      FullyQualifiedName: company?.name,
                      PrimaryEmailAddr: { Address: company?.email },
                      DisplayName: company?.name,
                      CompanyName: company?.name,
                      BillAddr: { Line1: company?.address || 'No Address' },
                      GivenName: company?.name,
                      Notes: company?.id,
                    },
                    operation: 'create',
                  };
                }),
              );

              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const contactData = {
                BatchItemRequest: cleanedBatchItems,
              };

              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  contactData,
                  { headers },
                );
                const quickBookCustomer = response.data.BatchItemResponse;

                if (quickBookCustomer) {
                  for (const company of newCompanyArray) {
                    const matchedCustomer = quickBookCustomer.find(
                      (qbProduct) => qbProduct?.Customer?.Notes == company.id,
                    );
                    if (!matchedCustomer?.Customer?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-contact.acc-service-contact',
                      {
                        data: {
                          company: company.id,
                          accountingServiceId: matchedCustomer?.Customer?.Id,
                          businessLocation: service.businessLocation.id,
                          syncToken: matchedCustomer?.Customer?.SyncToken,
                          isSynced: true,
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const company of newCompanyArray) {
                  await strapi.entityService.create(
                    'api::acc-service-contact.acc-service-contact',
                    {
                      data: {
                        company: company.id,
                        accountingServiceId: company?.oldCompanyServiceId,
                        businessLocation: service.businessLocation.id,
                        syncToken: company?.syncToken,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const company of newCompanyArray) {
                const updatedContact = await strapi.entityService.findOne(
                  'api::company.company',
                  company.id,
                  {
                    populate: [
                      'company',
                      'accServiceContacts',
                      'accServiceContacts.accServiceConn',
                    ],
                  },
                );

                if (!updatedContact?.accServiceContact?.length) continue;

                const oldCustomer =
                  await updatedContact?.accServiceContacts?.filter(
                    (accService) =>
                      accService.accServiceConn.serviceJson.realmId ===
                      serviceJson.realmId,
                  );

                await strapi.entityService.create(
                  'api::acc-service-contact.acc-service-contact',
                  {
                    data: {
                      company: company.id,
                      accountingServiceId: oldCustomer[0].accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldCustomer[0].syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchCompanyAsCustomerWithQuickBooks',
          'Failed to Batch sync Company with Quick Books',
          error,
        );
      }
    },
    async syncCompanytWithXero(
      companyId: ID,
      operationName: AccountingserviceOperation,
      tenantId: ID,
    ) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      const company = await strapi.entityService.findOne(
        'api::company.company',
        companyId,
        {
          populate: ['accServiceContacts'],
        },
      );

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingContactService = await strapi.db
          .query('api::acc-service-contact.acc-service-contact')
          .findOne({
            where: {
              comapny: company?.id,
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });
        if (operationName === 'update' && !accountingContactService) {
          continue;
        }

        const companyData: ContactData = {
          Contacts: [
            {
              Name: company?.name,
              EmailAddress: company?.email,
              Addresses: [
                {
                  AddressType: 'STREET',
                  AddressLine1: company?.address || 'No Address',
                },
              ],
              IsCustomer: true,
            },
          ],
        };

        const headers = {
          'Authorization': `Bearer ${accountingServices[index]?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingServices[index]?.id,
          'Xero-Tenant-Id':
            accountingServices[index]?.serviceJson?.xeroTenantId,
        };

        try {
          if (operationName === 'update' && accountingContactService) {
            companyData.Contacts[0].ContactID =
              accountingContactService.accountingServiceId;
            await xeroApi.post(`/Contacts`, companyData, { headers });
          } else {
            const response = await xeroApi.post(`/Contacts`, companyData, {
              headers,
            });

            if (response) {
              await strapi.entityService.create(
                'api::acc-service-contact.acc-service-contact',
                {
                  data: {
                    company: companyId,
                    accountingServiceId: response?.data?.Contacts[0]?.ContactID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'xero',
                    accServiceConn: accountingServices[index]?.id,
                  },
                },
              );
            }
          }
        } catch (error) {
          handleError(
            'syncCompanytWithXero',
            'Failed to sync Company with Xero',
            error,
          );
        }
      }
    },
    async syncBatchCompanyWithXero(companies, tenantId: ID) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (
        let serviceIndex = 0;
        serviceIndex < accountingServices?.length;
        serviceIndex++
      ) {
        const service = accountingServices[serviceIndex];
        const newContactArray = [];
        for (const company of companies) {
          const accountingContactService = await strapi.db
            .query('api::acc-service-contact.acc-service-contact')
            .findOne({
              where: {
                company: company?.id,
                businessLocation: service?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingContactService) {
            newContactArray.push(company);
          }
        }

        const headers = {
          'Authorization': `Bearer ${service?.serviceJson?.accessToken}`,
          'accountingServiceId': service?.id,
          'Xero-Tenant-Id': service?.serviceJson?.xeroTenantId,
        };

        // Divide the contacts into batches of 50
        for (let i = 0; i < newContactArray.length; i += 50) {
          const batchedCompanies = newContactArray
            .slice(i, i + 50)
            .map((company) => {
              const companyData = {
                Name: company?.name,
                EmailAddress: company?.email,
                Addresses: [
                  {
                    AddressType: 'STREET',
                    AddressLine1: company?.address || 'No Address',
                  },
                ],
                IsCustomer: true,
              };

              return companyData;
            });

          const payload = { Contacts: batchedCompanies };

          try {
            if (payload?.Contacts?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Contacts`, payload, {
              headers,
            });

            if (response) {
              const createdContacts = response?.data?.Contacts || [];
              for (const createdContact of createdContacts) {
                const matchedCompany = newContactArray.find(
                  (c) => c.email === createdContact?.EmailAddress,
                );
                if (matchedCompany) {
                  await strapi.entityService.create(
                    'api::acc-service-contact.acc-service-contact',
                    {
                      data: {
                        company: matchedCompany.id,
                        accountingServiceId: createdContact?.ContactID,
                        businessLocation: service?.businessLocation?.id,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'xero',
                        accServiceConn: service?.id,
                      },
                    },
                  );
                }
              }
            }
          } catch (error) {
            handleError(
              'syncBatchCompanyWithXero',
              'Failed to Batch Sync Company with Xero',
              error,
            );
          }
        }
      }
    },
  }),
);
