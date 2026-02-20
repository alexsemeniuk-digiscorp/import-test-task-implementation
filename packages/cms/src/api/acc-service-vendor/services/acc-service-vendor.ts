/**
 * acc-service-vendor service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleError } from '../../../graphql/helpers/errors';
import quickBookApi from '../../helpers/quickBooksApi';
import { ServiceJsonType } from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-service-vendor.acc-service-vendor',
  ({ strapi }) => ({
    async syncContactAsVendorWithQuickBooks(contactId: ID) {
      try {
        const contact = await strapi.entityService.findOne(
          'api::contact.contact',
          contactId,
          {
            populate: [
              'company',
              'accServiceVendors',
              'accServiceVendors.accServiceConn',
              'tenant',
            ],
          },
        );
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: { $eq: 'quickBooks' },
              tenant: { id: { $eq: contact.tenant.id } },
            },
            populate: ['businessLocation'],
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        const syncedRealmIds: string[] = [];
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            let quickBookCustomer;
            const data = {
              DisplayName: `${contact?.fullName} - Vendor`,
              PrimaryEmailAddr: {
                Address: contact?.email,
              },
              CompanyName: contact?.company?.name,
              PrimaryPhone: {
                FreeFormNumber: contact?.phoneNumber,
              },
              Suffix: '-Vendor',
              GivenName: contact?.fullName,
              BillAddr: {
                Line1: contact?.address,
              },
            };
            if (!contact?.company?.name) {
              delete data.CompanyName;
            }
            if (!contact?.address) {
              delete data.BillAddr;
            }
            const accountingServiceVendor = await strapi.db
              .query('api::acc-service-vendor.acc-service-vendor')
              .findOne({
                where: {
                  contact: contactId,
                  serviceType: 'quickBooks',
                  businessLocation: service.businessLocation.id,
                },
              });
            if (accountingServiceVendor) {
              data['Id'] = accountingServiceVendor?.accountingServiceId;
              data['SyncToken'] = accountingServiceVendor?.syncToken;
            }
            if (!syncedRealmIds.includes(serviceJson.realmId)) {
              syncedRealmIds.push(serviceJson.realmId);
              try {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: accountingServices.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/vendor`,
                  data,
                  { headers },
                );
                quickBookCustomer = response.data.Vendor;
              } catch (error) {
                handleError(
                  'syncContactAsVendorWithQuickBooks',
                  'Failed to Sync contact as Vendor with Quick Books',
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
                    'accServiceVendors',
                    'accServiceVendors.accServiceConn',
                  ],
                },
              );
            const oldVendor =
              await updatedAccountingServiceProduct?.accServiceVendors?.map(
                (accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson?.realmId
                    ? accService
                    : null,
              );
            if (accountingServiceVendor?.id && quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-vendor.acc-service-vendor',
                accountingServiceVendor?.id,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: quickBookCustomer.SyncToken,
                  },
                },
              );
            } else if (
              serviceJson.realmId &&
              !accountingServiceVendor?.id &&
              oldVendor[0]?.accountingServiceId
            ) {
              await strapi.entityService.create(
                'api::acc-service-vendor.acc-service-vendor',
                {
                  data: {
                    contact: contactId,
                    accountingServiceId: oldVendor[0].accountingServiceId,
                    businessLocation: service.businessLocation.id,
                    syncToken: oldVendor[0].syncToken,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'quickBooks',
                    accServiceConn: service.id,
                    type: 'contact',
                  },
                },
              );
            } else if (accountingServiceVendor?.id && !quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-vendor.acc-service-vendor',
                accountingServiceVendor?.id,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: oldVendor[0].syncToken,
                  },
                },
              );
            } else {
              if (quickBookCustomer) {
                await strapi.entityService.create(
                  'api::acc-service-vendor.acc-service-vendor',
                  {
                    data: {
                      contact: contactId,
                      accountingServiceId: quickBookCustomer.Id,
                      businessLocation: service.businessLocation.id,
                      syncToken: quickBookCustomer.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'contact',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncContactAsVendorWithQuickBooks',
          'Failed to Sync contact as Vendor with Quick Books',
          error,
        );
      }
    },
    async syncCompanyAsVendorWithQuickBooks(companyId: ID, tenantId: ID) {
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
            populate: ['accServiceVendors', 'accServiceVendors.accServiceConn'],
          },
        );
        const syncedRealmIds: string[] = [];
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            let quickBookCustomer;
            const data = {
              DisplayName: `${company?.name} - Vendor`,
              PrimaryEmailAddr: {
                Address: company?.email,
              },
              CompanyName: company?.name,
              PrimaryPhone: {
                FreeFormNumber: company?.phoneNumber,
              },
              Suffix: '-Vendor',
              GivenName: company?.name,
              BillAddr: {
                Line1: company?.address,
              },
              WebAddr: {
                URI: company?.website?.replace(
                  /^(?!https?:\/\/|www\.)/,
                  'https://',
                ),
              },
            };
            if (!company?.name) {
              delete data.CompanyName;
            }
            if (!company?.address) {
              delete data.BillAddr;
            }
            if (!company?.website) {
              delete data.WebAddr;
            }
            let accountingServiceId: ID;
            const accountingServiceVendor = await strapi.db
              .query('api::acc-service-vendor.acc-service-vendor')
              .findOne({
                where: {
                  company: companyId,
                  serviceType: 'quickBooks',
                  businessLocation: service.businessLocation.id,
                },
              });
            if (accountingServiceVendor) {
              data['Id'] = accountingServiceVendor?.accountingServiceId;
              data['SyncToken'] = accountingServiceVendor?.syncToken;
              accountingServiceId = accountingServiceVendor?.id;
            }
            if (!syncedRealmIds.includes(serviceJson.realmId)) {
              syncedRealmIds.push(serviceJson.realmId);
              try {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: accountingServices.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/vendor`,
                  data,
                  { headers },
                );
                quickBookCustomer = response.data.Vendor;
              } catch (error) {
                handleError(
                  'syncCompanyAsVendorWithQuickBooks',
                  'Failed to Sync Company as Vendor with Quick Books',
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
                    'accServiceVendors',
                    'accServiceVendors.accServiceConn',
                  ],
                },
              );
            const oldVendor =
              await updatedAccountingServiceProduct?.accServiceVendors?.map(
                (accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson?.realmId
                    ? accService
                    : null,
              );
            if (accountingServiceVendor?.id && quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-vendor.acc-service-vendor',
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
              !accountingServiceVendor?.id &&
              oldVendor[0]?.accountingServiceId
            ) {
              await strapi.entityService.create(
                'api::acc-service-vendor.acc-service-vendor',
                {
                  data: {
                    company: companyId,
                    accountingServiceId: oldVendor[0].accountingServiceId,
                    businessLocation: service.businessLocation.id,
                    syncToken: oldVendor[0].syncToken,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'quickBooks',
                    accServiceConn: service.id,
                    type: 'company',
                  },
                },
              );
            } else if (accountingServiceVendor?.id && !quickBookCustomer) {
              await strapi.entityService.update(
                'api::acc-service-vendor.acc-service-vendor',
                accountingServiceId,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: oldVendor[0].syncToken,
                  },
                },
              );
            } else {
              if (quickBookCustomer) {
                await strapi.entityService.create(
                  'api::acc-service-vendor.acc-service-vendor',
                  {
                    data: {
                      company: companyId,
                      accountingServiceId: quickBookCustomer.Id,
                      businessLocation: service.businessLocation.id,
                      syncToken: quickBookCustomer.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'company',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncCompanyAsVendorWithQuickBooks',
          'Failed to Sync Company as Vendor with Quick Books -2 ',
          error,
        );
      }
    },
    async syncBatchContactAsVendorWithQuickBooks(contacts, tenantId) {
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
        const syncedRealmIds: Set<string> = new Set();
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            const newContactsArray = [];

            for (const contact of contacts) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-vendor.acc-service-vendor')
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
                      'accServiceVendors.accServiceConn',
                      'productInventoryItems',
                      'revenueChartAccount',
                      'revenueChartCategory',
                      'revenueChartSubcategory',
                      'costChartAccount',
                      'costChartCategory',
                      'costChartSubcategory',
                      'tenant',
                    ],
                  },
                );
                const oldContact = item?.accServiceVendors.map((accService) =>
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
                newContactsArray.map(async (contact, index) => {
                  if (contact?.oldContactServiceId) return null;

                  return {
                    bId: index,
                    Vendor: {
                      DisplayName: `${contact?.fullName} - Vendor`,
                      PrimaryEmailAddr: {
                        Address: contact?.email,
                      },
                      CompanyName: contact?.company?.name,
                      PrimaryPhone: {
                        FreeFormNumber: contact?.phoneNumber,
                      },
                      Suffix: '-Vendor',
                      GivenName: contact?.fullName,
                      BillAddr: {
                        Line1: contact?.address ?? 'No Address',
                      },
                    },
                    operation: 'create',
                  };
                }),
              );

              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              ); // removes null and undefined

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
                const quickBookVendor = response.data.BatchItemResponse;

                if (quickBookVendor) {
                  for (const contact of newContactsArray) {
                    const matchedCustomer = quickBookVendor.find(
                      (qbProduct) =>
                        qbProduct?.Vendor?.PrimaryEmailAddr?.Address ==
                        contact?.email,
                    );
                    if (!matchedCustomer?.Vendor?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-vendor.acc-service-vendor',
                      {
                        data: {
                          contact: contact.id,
                          accountingServiceId: matchedCustomer?.Vendor?.Id,
                          businessLocation: service.businessLocation.id,
                          syncToken: matchedCustomer?.Vendor?.SyncToken,
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
                    'api::acc-service-vendor.acc-service-vendor',
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
                      'accServiceVendors',
                      'accServiceVendors.accServiceConn',
                    ],
                  },
                );
                if (!updatedContact?.accServiceVendors?.length) continue;

                const oldCustomer =
                  await updatedContact.accServiceVendors?.filter(
                    (accService) =>
                      accService.accServiceConn.serviceJson.realmId ===
                      serviceJson.realmId,
                  );

                await strapi.entityService.create(
                  'api::acc-service-vendor.acc-service-vendor',
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
          'syncBatchContactAsVendorWithQuickBooks',
          'Failed to Batch Sync Contact as Vendor with Quick Books',
          error,
        );
      }
    },
    async syncBatchCompanyAsVendorWithQuickBooks(companies, tenantId) {
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
        const syncedRealmIds: Set<string> = new Set();
        for (const service of accountingServices) {
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            const newCompaniesArray = [];
            for (const company of companies) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-vendor.acc-service-vendor')
                .findOne({
                  where: {
                    contact: company?.id,
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
                    populate: ['accServiceVendors.accServiceConn', 'tenant'],
                  },
                );
                const oldCompany = item.accServiceVendors.map((accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson.realmId
                    ? accService
                    : null,
                );
                item.oldCompanyServiceId = oldCompany[0]?.accountingServiceId;
                item.syncToken = oldCompany[0]?.syncToken;
                newCompaniesArray.push(item);
              }
            }

            if (!newCompaniesArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);

              const batchItems = await Promise.all(
                newCompaniesArray.map(async (company, index) => {
                  if (company?.oldContactServiceId) return null;

                  const data = {
                    bId: index,
                    Vendor: {
                      DisplayName: `${company?.name} - Vendor`,
                      PrimaryEmailAddr: {
                        Address: company?.email,
                      },
                      CompanyName: company?.name,
                      PrimaryPhone: {
                        FreeFormNumber: company?.phoneNumber ?? 0,
                      },
                      Suffix: '-Vendor',
                      GivenName: company?.name,
                      BillAddr: {
                        Line1: company?.address ?? 'No Address',
                      },
                      WebAddr: {
                        URI: company?.website?.replace(
                          /^(?!https?:\/\/|www\.)/,
                          'https://',
                        ),
                      },
                    },
                    operation: 'create',
                  };
                  if (!company?.name) {
                    delete data.Vendor.CompanyName;
                  }
                  if (!company?.address) {
                    delete data.Vendor.BillAddr;
                  }
                  if (!company?.website) {
                    delete data.Vendor.WebAddr;
                  }
                  return data;
                }),
              );

              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              ); // removes null and undefined

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
                const quickBookVendor = response.data.BatchItemResponse;
                if (quickBookVendor) {
                  for (const company of newCompaniesArray) {
                    const matchedCustomer = quickBookVendor.find(
                      (qbProduct) =>
                        qbProduct?.Vendor?.PrimaryEmailAddr?.Address ==
                        company?.email,
                    );
                    if (!matchedCustomer?.Vendor?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-vendor.acc-service-vendor',
                      {
                        data: {
                          company: company.id,
                          accountingServiceId: matchedCustomer?.Vendor?.Id,
                          businessLocation: service.businessLocation.id,
                          syncToken: matchedCustomer?.Vendor?.SyncToken,
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
                for (const company of newCompaniesArray) {
                  await strapi.entityService.create(
                    'api::acc-service-vendor.acc-service-vendor',
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
              for (const company of newCompaniesArray) {
                const updatedCompany = await strapi.entityService.findOne(
                  'api::company.company',
                  company.id,
                  {
                    populate: [
                      'accServiceVendors',
                      'accServiceVendors.accServiceConn',
                    ],
                  },
                );

                if (!updatedCompany?.accServiceVendors?.length) continue;

                const oldCustomer =
                  await updatedCompany?.accServiceVendors?.filter(
                    (accService) =>
                      accService?.accServiceConn?.serviceJson?.realmId ===
                      serviceJson?.realmId,
                  );

                await strapi.entityService.create(
                  'api::acc-service-vendor.acc-service-vendor',
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
          'syncBatchCompanyAsVendorWithQuickBooks',
          'Failed to Batch Sync Company as Vendor with Quick Books',
          error,
        );
      }
    },
  }),
);
