/**
 * acc-service-entity service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleError } from '../../../graphql/helpers/errors';
import {
  DEFAULT_SERVICE,
  DEFAULT_SKU,
  TRAKING_CATEGORY,
} from '../../helpers/constants';
import { fetchServiceAccountId } from '../../helpers/getAccountingServiceId';
import quickBookApi from '../../helpers/quickBooksApi';
import xeroApi from '../../helpers/xeroApi';
import {
  AccountingserviceOperation,
  ServiceJsonType,
} from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-service-entity.acc-service-entity',
  ({ strapi }) => ({
    async syncProductWithQuickBooks(productId: ID) {
      try {
        if (!productId) {
          return;
        }
        //getting all the updated values
        const product = await strapi.entityService.findOne(
          'api::product.product',
          productId,
          {
            populate: [
              'company',
              'accServiceEntities',
              'accServiceEntities.accServiceConn',
              'productInventoryItems',
              'revenueChartAccount',
              'revenueChartAccount.accProductMappings',
              'revenueChartCategory',
              'revenueChartCategory.accProductMappings',
              'revenueChartSubcategory',
              'revenueChartSubcategory.accProductMappings',
              'costChartAccount',
              'costChartAccount.accProductMappings',
              'costChartCategory',
              'costChartCategory.accProductMappings',
              'costChartSubcategory',
              'costChartSubcategory.accProductMappings',
              'tenant',
            ],
          },
        );
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              tenant: { id: { $eq: product.tenant.id } },
            },
            populate: [
              'businessLocation',
              'accProductMappings',
              'accProductMappings.chartAccount',
              'accProductMappings.chartCategory',
              'accProductMappings.chartSubcategory',
            ],
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'product',
            tenantId: product.tenant.id,
            serviceType: 'quickBooks',
          });
        if (!mappingStatus) {
          return new Error(`Please complete the quickBooks mapping.`);
        }
        if (!accountingServices?.length) {
          return;
        }
        const syncedRealmIds: string[] = [];
        const quantity = await product.productInventoryItems?.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        for (const service of accountingServices) {
          const incomeId = await fetchServiceAccountId(
            product,
            null,
            service,
            'revenue',
          );
          const expenseId = await fetchServiceAccountId(
            product,
            null,
            service,
            'cost',
          );
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            let quickBookItem;
            const data = {
              TrackQtyOnHand: true,
              Name: product.name,
              QtyOnHand: quantity,
              IncomeAccountRef: {
                value: incomeId || serviceJson.defaultRevenue,
              },
              AssetAccountRef: {
                value: serviceJson.inventoryAsset,
              },
              InvStartDate: new Date(),
              Type: 'Inventory',
              ExpenseAccountRef: {
                value: expenseId || serviceJson.defaultCost,
              },
              UnitPrice: product.defaultPrice,
              Sku: product?.SKU || DEFAULT_SKU,
            };
            const accountingServiceProduct = await strapi.db
              .query('api::acc-service-entity.acc-service-entity')
              .findOne({
                where: {
                  product: productId,
                  serviceType: 'quickBooks',
                  businessLocation: service.businessLocation.id,
                  type: 'product',
                },
              });
            if (accountingServiceProduct) {
              data['Id'] = accountingServiceProduct?.accountingServiceId;
              data['SyncToken'] = accountingServiceProduct?.syncToken;
            }
            if (!syncedRealmIds.includes(serviceJson.realmId)) {
              syncedRealmIds.push(serviceJson.realmId);

              try {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/item`,
                  data,
                  { headers },
                );
                if (!response?.data?.Item) {
                  return;
                }
                quickBookItem = response.data.Item;
              } catch (error) {
                handleError(
                  'syncProductWithQuickBooks',
                  'Failed to create product with Quick Books',
                  error,
                );
              }
            }
            const updatedAccountingServiceProduct =
              await strapi.entityService.findOne(
                'api::product.product',
                productId,
                {
                  populate: [
                    'company',
                    'accServiceEntities',
                    'accServiceEntities.accServiceConn',
                    'productInventoryItems',
                    'revenueChartAccount',
                    'revenueChartAccount.accProductMappings',
                    'revenueChartCategory',
                    'revenueChartCategory.accProductMappings',
                    'revenueChartSubcategory',
                    'revenueChartSubcategory.accProductMappings',
                    'costChartAccount',
                    'costChartAccount.accProductMappings',
                    'costChartCategory',
                    'costChartCategory.accProductMappings',
                    'costChartSubcategory',
                    'costChartSubcategory.accProductMappings',
                    'tenant',
                  ],
                },
              );
            const oldProduct =
              updatedAccountingServiceProduct.accServiceEntities.map(
                (accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson.realmId
                    ? accService
                    : null,
              );
            if (accountingServiceProduct?.id && quickBookItem) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingServiceProduct?.id,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: quickBookItem?.SyncToken,
                  },
                },
              );
            } else if (
              serviceJson?.realmId &&
              !accountingServiceProduct?.id &&
              oldProduct[0]?.accountingServiceId
            ) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    product: productId,
                    accountingServiceId:
                      oldProduct[0]?.accountingServiceId ?? '',
                    businessLocation: service.businessLocation.id,
                    syncToken: oldProduct[0].syncToken,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'quickBooks',
                    accServiceConn: service.id,
                    type: 'product',
                  },
                },
              );
            } else if (accountingServiceProduct?.id && !quickBookItem) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingServiceProduct?.id,
                {
                  data: {
                    syncDate: new Date(),
                    syncToken: oldProduct[0].syncToken,
                  },
                },
              );
            } else {
              if (quickBookItem) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      product: productId,
                      accountingServiceId: quickBookItem?.Id ?? '',
                      businessLocation: service.businessLocation.id,
                      syncToken: quickBookItem?.SyncToken ?? '0',
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'product',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping product sync operation',
          );
          return;
        }
        handleError(
          'syncProductWithQuickBooks',
          'Failed to create product with Quick Books -2',
          error,
        );
      }
    },
    async syncServiceWithQuickBooks(serviceId: ID) {
      try {
        //getting all the updated values
        const syncedRealmIds: string[] = [];
        const serviceProduct = await strapi.entityService.findOne(
          'api::service.service',
          serviceId,
          {
            populate: [
              'revenueChartAccount',
              'revenueChartAccount.accProductMappings',
              'revenueChartCategory',
              'revenueChartCategory.accProductMappings',
              'revenueChartSubcategory',
              'revenueChartSubcategory.accProductMappings',
              'costChartAccount',
              'costChartAccount.accProductMappings',
              'costChartCategory',
              'costChartCategory.accProductMappings',
              'costChartSubcategory',
              'costChartSubcategory.accProductMappings',
              'accServiceEntities',
              'accServiceEntities.accServiceConn',
              'tenant',
            ],
          },
        );
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              tenant: { id: { $eq: serviceProduct.tenant.id } },
            },
            populate: [
              'businessLocation',
              'accProductMappings',
              'accProductMappings.chartAccount',
            ],
          },
        );
        if (!accountingServices?.length) {
          return;
        }

        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'service',
            tenantId: serviceProduct.tenant.id,
            serviceType: 'quickBooks',
          });
        if (!mappingStatus) {
          return new Error(`Please complete the quickBooks mapping.`);
        }

        if (accountingServices?.length) {
          for (const service of accountingServices) {
            const incomeId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'revenue',
            );
            const expenseId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'cost',
            );
            const serviceJson = service?.serviceJson as ServiceJsonType;
            if (serviceJson.realmId) {
              let quickBookItem;
              const data = {
                Name: serviceProduct.name,
                IncomeAccountRef: {
                  value: incomeId ?? serviceJson.defaultRevenue,
                },
                Type: 'Service',
                ExpenseAccountRef: {
                  value: expenseId ?? serviceJson.defaultCost,
                },
                UnitPrice: serviceProduct.defaultPrice,
              };
              const accountingService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    service: serviceId,
                    serviceType: 'quickBooks',
                    businessLocation: service.businessLocation.id,
                    type: 'service',
                  },
                });
              if (accountingService) {
                data['Id'] = accountingService?.accountingServiceId;
                data['SyncToken'] = accountingService?.syncToken;
              }
              if (!syncedRealmIds.includes(serviceJson?.realmId)) {
                syncedRealmIds.push(serviceJson?.realmId);
                try {
                  const headers = {
                    Authorization: `Bearer ${serviceJson?.accessToken}`,
                    accountingServiceId: service.id,
                  };

                  const response = await quickBookApi.post(
                    `/${serviceJson.realmId}/item`,
                    data,
                    { headers },
                  );
                  quickBookItem = await response.data.Item;
                } catch (error) {
                  handleError(
                    'syncServiceWithQuickBooks',
                    'Failed to create service with Quick Books',
                    error,
                  );
                }
              }
              const updatedAccountingServiceProduct =
                await strapi.entityService.findOne(
                  'api::service.service',
                  serviceId,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
              const oldProduct =
                updatedAccountingServiceProduct.accServiceEntities.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson?.realmId
                      ? accService
                      : null,
                );
              if (accountingService?.id && quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: quickBookItem?.SyncToken,
                    },
                  },
                );
              } else if (
                serviceJson.realmId &&
                !accountingService?.id &&
                oldProduct[0]?.accountingServiceId
              ) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      service: serviceId,
                      accountingServiceId: oldProduct[0].accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct[0].syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'service',
                    },
                  },
                );
              } else if (accountingService?.id && !quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: oldProduct[0].syncToken,
                    },
                  },
                );
              } else {
                if (quickBookItem) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        service: serviceId,
                        accountingServiceId: quickBookItem?.Id,
                        businessLocation: service.businessLocation.id,
                        syncToken: quickBookItem?.SyncToken,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                        type: 'service',
                      },
                    },
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping service sync operation',
          );
          return;
        }
        handleError(
          'syncServiceWithQuickBooks',
          'Failed to create service with Quick Books -2',
          error,
        );
      }
    },
    async syncProductWithXero(
      productId: ID,
      operationName: AccountingserviceOperation,
    ) {
      const product = await strapi.entityService.findOne(
        'api::product.product',
        productId,
        {
          populate: [
            'company',
            'accServiceEntities',
            'accServiceEntities.accServiceConn',
            'revenueChartAccount',
            'revenueChartAccount.accProductMappings',
            'revenueChartCategory',
            'revenueChartCategory.accProductMappings',
            'revenueChartSubcategory',
            'revenueChartSubcategory.accProductMappings',
            'costChartAccount',
            'costChartAccount.accProductMappings',
            'costChartCategory',
            'costChartCategory.accProductMappings',
            'costChartSubcategory',
            'costChartSubcategory.accProductMappings',
            'tenant',
          ],
        },
      );
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: product.tenant.id } },
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
      const accountingMappingService = await strapi.service(
        'api::acc-product-mapping.acc-product-mapping',
      );
      const mappingStatus = await accountingMappingService.defaultMappingStatus(
        {
          entityType: 'product',
          tenantId: product.tenant.id,
          serviceType: 'xero',
        },
      );

      if (!mappingStatus) {
        return new Error(`Please complete the quickBooks mapping.`);
      }

      for (const service of accountingServices) {
        const accountingItemService = await strapi.db
          .query('api::acc-service-entity.acc-service-entity')
          .findOne({
            where: {
              product: product?.id,
              type: 'product',
              businessLocation: service?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });

        const incomeId = await fetchServiceAccountId(
          product,
          null,
          service,
          'revenue',
        );
        const expenseId = await fetchServiceAccountId(
          product,
          null,
          service,
          'cost',
        );
        const itemData = {
          Items: [
            {
              Code: product?.productId,
              Description: product?.description ?? product?.name,
              PurchaseDetails: {
                UnitPrice: Number(product?.defaultPrice),
                COGSAccountCode: expenseId ?? service?.serviceJson?.defaultCost,
                TaxType: 'NONE',
              },
              SalesDetails: {
                UnitPrice: Number(product?.defaultPrice),
                AccountCode: incomeId ?? service?.serviceJson?.defaultRevenue,
                TaxType: 'NONE',
              },
              Name:
                product?.name?.length > 50
                  ? product.name.slice(0, 50)
                  : product.name,
              IsTrackedAsInventory: true,
              InventoryAssetAccountCode: service?.serviceJson?.inventoryAsset,
            },
          ],
        };
        const headers = {
          'Authorization': `Bearer ${service?.serviceJson?.accessToken}`,
          'accountingServiceId': service?.id,
          'Xero-Tenant-Id': service?.serviceJson?.xeroTenantId,
        };
        try {
          if (operationName === 'update' && accountingItemService) {
            // Update existing item in Xero
            const updateItemId = accountingItemService?.accountingServiceId;
            const response = await xeroApi.post(
              `/Items/${updateItemId}`,
              itemData,
              { headers },
            );

            if (response) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingItemService.id,
                {
                  data: {
                    syncToken: '0',
                    syncDate: new Date(),
                  },
                },
              );
            }
          } else if (!accountingItemService) {
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });

            if (response) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    product: productId,
                    accountingServiceId: response?.data?.Items[0]?.ItemID,
                    businessLocation: service?.businessLocation?.id,
                    isSynced: true,
                    syncToken: '0',
                    type: 'product',
                    syncDate: new Date(),
                    serviceType: 'xero',
                    accServiceConn: service?.id,
                  },
                },
              );

              // Get Xero contacts
              const contactsResponse = await xeroApi.get(`/Contacts`, {
                headers,
              });
              const accountingServiceTracking =
                service?.tenant?.accServiceTrack?.filter(
                  (option) => option?.name === TRAKING_CATEGORY,
                );

              const productsInventoryItems = await strapi.db
                .query('api::product-inventory-item.product-inventory-item')
                .findMany({
                  where: {
                    product: product?.id,
                  },
                });
              const productQuantity = productsInventoryItems?.reduce(
                (sum, item) => sum + item?.quantity,
                0,
              );
              // Create Bill in Xero to update Product Quantity
              const billData = {
                Type: 'ACCPAY',
                Contact: {
                  ContactId:
                    contactsResponse?.data?.Contacts?.[
                      contactsResponse?.data?.Contacts?.length - 1
                    ]?.ContactID?.toString(),
                },
                Date: new Date().toISOString(),
                DueDate: new Date().toISOString(),
                LineItems: [
                  {
                    ItemCode: product?.productId,
                    Quantity: productQuantity > 0 ? Number(productQuantity) : 0,
                    Tracking: [
                      {
                        TrackingCategoryID:
                          accountingServiceTracking[0].accountingServiceId,
                        TrackingOptionID: service?.serviceJson?.class,
                      },
                    ],
                  },
                ],
                Status: 'AUTHORISED',
              };

              try {
                await xeroApi.post(`/Invoices`, billData, { headers });
              } catch (error) {
                handleError(
                  'syncProductWithXero',
                  'Failed to create Product with Xero',
                  error,
                );
              }
            }
          }
        } catch (error) {
          handleError(
            'syncProductWithXero',
            'Failed to create Product with Xero -2',
            error,
          );
        }
      }
    },
    async syncBatchProductWithXero(products, tenantId) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
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

      for (const service of accountingServices) {
        const newProductsArray = [];
        for (const product of products.filter((item) => item?.productId)) {
          const accountingItemService = await strapi.db
            .query('api::acc-service-entity.acc-service-entity')
            .findOne({
              where: {
                product: product?.id,
                type: 'product',
                businessLocation: service?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingItemService) {
            newProductsArray.push(product);
          }
        }

        const headers = {
          'Authorization': `Bearer ${service?.serviceJson?.accessToken}`,
          'accountingServiceId': service?.id,
          'Xero-Tenant-Id': service?.serviceJson?.xeroTenantId,
        };

        const itemData = {
          Items: await Promise.all(
            newProductsArray.map(async (product) => {
              const incomeId = await fetchServiceAccountId(
                product,
                null,
                service,
                'revenue',
              );
              const expenseId = await fetchServiceAccountId(
                product,
                null,
                service,
                'cost',
              );

              return {
                Code: product?.productId,
                Description: product?.description ?? product?.name,
                PurchaseDetails: {
                  UnitPrice: Number(product?.defaultPrice),
                  COGSAccountCode:
                    expenseId || service?.serviceJson?.defaultCost,
                  TaxType: 'NONE',
                },
                SalesDetails: {
                  UnitPrice: Number(product?.defaultPrice),
                  AccountCode: incomeId || service?.serviceJson?.defaultRevenue,
                  TaxType: 'NONE',
                },
                Name:
                  product?.name?.length > 50
                    ? product.name.slice(0, 50)
                    : product.name,
                IsTrackedAsInventory: true,
                InventoryAssetAccountCode: service?.serviceJson?.inventoryAsset,
              };
            }),
          ),
        };
        try {
          if (itemData?.Items?.length === 0) {
            continue;
          }
          const response = await xeroApi.post(`/Items`, itemData, { headers });

          if (response) {
            for (const product of newProductsArray) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    product: product.id,
                    accountingServiceId: response?.data?.Items.find(
                      (item) => item.Code == product.productId,
                    )?.ItemID,
                    businessLocation: service?.businessLocation?.id,
                    isSynced: true,
                    syncToken: '0',
                    type: 'product',
                    syncDate: new Date(),
                    serviceType: 'xero',
                    accServiceConn: service?.id,
                  },
                },
              );
            }
          }

          // Get Xero contacts
          const contactsResponse = await xeroApi.get(`/Contacts`, { headers });
          const accountingServiceTracking =
            service?.tenant?.accServiceTrack?.filter(
              (option) => option?.name === TRAKING_CATEGORY,
            );

          const lineItems = await Promise.all(
            newProductsArray.map(async (product) => {
              const quantity =
                product?.productInventoryItems?.reduce(
                  (acc, item) => acc + item.quantity,
                  0,
                ) || 0;
              return {
                ItemCode: product?.productId,
                Quantity: quantity > 0 ? Number(quantity) : 0,
                Tracking: [
                  {
                    TrackingCategoryID:
                      accountingServiceTracking[0]?.accountingServiceId,
                    TrackingOptionID: service?.serviceJson?.class,
                  },
                ],
              };
            }),
          );

          // Construct the billData object
          const billData = {
            Type: 'ACCPAY',
            Contact: {
              ContactId:
                contactsResponse?.data?.Contacts?.[
                  contactsResponse?.data?.Contacts?.length - 1
                ]?.ContactID?.toString(),
            },
            Date: new Date().toISOString(),
            DueDate: new Date().toISOString(),
            LineItems: lineItems,
            Status: 'AUTHORISED',
          };

          try {
            await xeroApi.post(`/Invoices`, billData, { headers });
          } catch (error) {
            handleError(
              'syncBatchProductWithXero',
              'Failed to create Invocie Product with Xero',
              error,
            );
          }
        } catch (error) {
          handleError(
            'syncBatchProductWithXero',
            'Failed to Batch Sync Product with Xero',
            error,
          );
        }
      }
    },
    async syncServiceWithXero(
      serviceId: ID,
      operationName: AccountingserviceOperation,
    ) {
      const service = await strapi.entityService.findOne(
        'api::service.service',
        serviceId,
        {
          populate: [
            'revenueChartAccount',
            'revenueChartAccount.accProductMappings',
            'revenueChartCategory',
            'revenueChartCategory.accProductMappings',
            'revenueChartSubcategory',
            'revenueChartSubcategory.accProductMappings',
            'costChartAccount',
            'costChartAccount.accProductMappings',
            'costChartCategory',
            'costChartCategory.accProductMappings',
            'costChartSubcategory',
            'costChartSubcategory.accProductMappings',
            'accServiceEntities',
            'accServiceEntities.accServiceConn',
            'tenant',
          ],
        },
      );
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: {
              id: {
                $eq: service.tenant.id,
              },
            },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      const accountingMappingService = await strapi.service(
        'api::acc-product-mapping.acc-product-mapping',
      );
      const mappingStatus = await accountingMappingService.defaultMappingStatus(
        {
          entityType: 'service',
          tenantId: service.tenant.id,
          serviceType: 'xero',
        },
      );

      if (!mappingStatus) {
        return new Error(`Please complete the quickBooks mapping.`);
      }

      if (!accountingServices?.length) {
        return;
      }

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingItemService = await strapi.db
          .query('api::acc-service-entity.acc-service-entity')
          .findOne({
            where: {
              service: service?.id,
              type: 'service',
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });

        const incomeId = await fetchServiceAccountId(
          service,
          null,
          accountingServices[index],
          'revenue',
        );

        const itemData = {
          Items: [
            {
              Code: service?.serviceId,
              Description: service?.description ?? service?.name,
              PurchaseDetails: {
                UnitPrice: Number(service?.defaultPrice),
                COGSAccountCode: '',
                TaxType: 'NONE',
              },
              SalesDetails: {
                UnitPrice: Number(service?.defaultPrice),
                AccountCode: incomeId ?? service?.serviceJson?.defaultRevenue,
                TaxType: 'NONE',
              },
              Name:
                service?.name?.length > 50
                  ? service.name.slice(0, 50)
                  : service.name,
              IsTrackedAsInventory: false,
              InventoryAssetAccountCode: '',
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
          if (operationName === 'update' && accountingItemService) {
            // Update existing item in Xero
            const updateItemId = accountingItemService.accountingServiceId;
            const response = await xeroApi.post(
              `/Items/${updateItemId}`,
              itemData,
              { headers },
            );

            if (response) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingItemService.id,
                {
                  data: {
                    syncToken: response?.data?.Items[0]?.UpdatedDateUTC,
                    syncDate: new Date(),
                  },
                },
              );
            }
          } else if (!accountingItemService) {
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    service: serviceId,
                    accountingServiceId: response?.data?.Items[0]?.ItemID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncToken: '0',
                    type: 'service',
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
            'syncServiceWithXero',
            'Failed to Sync Service with Xero',
            error,
          );
        }
      }
    },
    async syncBatchServiceWithXero(services, tenantId) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (const accountingService of accountingServices) {
        const newServicesArray = [];
        for (const service of services) {
          const accountingItemService = await strapi.db
            .query('api::acc-service-entity.acc-service-entity')
            .findOne({
              where: {
                service: service?.id,
                type: 'service',
                businessLocation: accountingService?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingItemService) {
            newServicesArray.push(service);
          }
        }

        const headers = {
          'Authorization': `Bearer ${accountingService?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingService?.id,
          'Xero-Tenant-Id': accountingService?.serviceJson?.xeroTenantId,
        };

        // Process services in batches of 50
        const serviceBatches = [];
        for (let i = 0; i < newServicesArray.length; i += 50) {
          serviceBatches.push(newServicesArray.slice(i, i + 50));
        }

        for (const batch of serviceBatches) {
          const itemData = {
            Items: await Promise.all(
              batch.map(async (service) => {
                const incomeId = await fetchServiceAccountId(
                  service,
                  null,
                  accountingService,
                  'revenue',
                );
                return {
                  Code: service?.serviceId,
                  Description: service?.description ?? service?.name,
                  PurchaseDetails: {
                    UnitPrice: Number(service?.defaultPrice),
                    COGSAccountCode: '',
                    TaxType: 'NONE',
                  },
                  SalesDetails: {
                    UnitPrice: Number(service?.defaultPrice),
                    AccountCode:
                      incomeId ||
                      accountingService?.serviceJson?.defaultRevenue,
                    TaxType: 'NONE',
                  },
                  Name:
                    service?.name?.length > 50
                      ? service.name.slice(0, 50)
                      : service.name,
                  IsTrackedAsInventory: false,
                  InventoryAssetAccountCode: '',
                };
              }),
            ),
          };

          try {
            if (itemData?.Items?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              for (const service of batch) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      service: service.id,
                      accountingServiceId: response?.data?.Items.find(
                        (item) => item.Code == service.serviceId,
                      )?.ItemID,
                      businessLocation: accountingService?.businessLocation?.id,
                      isSynced: true,
                      syncToken: '0',
                      type: 'service',
                      syncDate: new Date(),
                      serviceType: 'xero',
                      accServiceConn: accountingService?.id,
                    },
                  },
                );
              }
            }
          } catch (error) {
            handleError(
              'syncServiceWithXero',
              'Failed to Batch Sync Services with Xero',
              error,
            );
          }
        }
      }
    },
    async syncBatchProductWithQuickBooks(products, tenantId) {
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
          if (service?.isProductNotSynced) {
            return;
          }
          const serviceJson = service?.serviceJson as ServiceJsonType;
          if (serviceJson?.realmId) {
            const newProductsArray = [];
            for (const product of products) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    product: product?.id,
                    type: 'product',
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::product.product',
                  product?.id,
                  {
                    populate: [
                      'company',
                      'accServiceEntities.accServiceConn',
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
                const oldProduct = item.accServiceEntities.map((accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson.realmId
                    ? accService
                    : null,
                );
                item.oldProductServiceId = oldProduct[0]?.accountingServiceId;
                item.syncToken = oldProduct[0]?.syncToken;
                newProductsArray.push(item);
              }
            }
            if (!newProductsArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newProductsArray.map(async (product, index) => {
                  if (product?.oldProductServiceId) {
                    return null;
                  }
                  const incomeId = await fetchServiceAccountId(
                    product,
                    null,
                    service,
                    'revenue',
                  );
                  const expenseId = await fetchServiceAccountId(
                    product,
                    null,
                    service,
                    'cost',
                  );
                  const quantity =
                    product.productInventoryItems?.reduce(
                      (acc, item) => acc + item.quantity,
                      0,
                    ) || 0;

                  return {
                    bId: index,
                    Item: {
                      TrackQtyOnHand: true,
                      Name: product.name,
                      QtyOnHand: quantity,
                      IncomeAccountRef: {
                        value: incomeId ?? serviceJson.defaultRevenue,
                      },
                      AssetAccountRef: { value: serviceJson.inventoryAsset },
                      InvStartDate: new Date().toISOString(),
                      Type: 'Inventory',
                      ExpenseAccountRef: {
                        value: expenseId ?? serviceJson.defaultCost,
                      },
                      UnitPrice: product.defaultPrice,
                      Sku: product?.SKU ?? DEFAULT_SKU,
                      Description: product.id,
                    },
                    operation: 'create',
                  };
                }),
              );
              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const itemData = {
                BatchItemRequest: cleanedBatchItems,
              };
              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  itemData,
                  { headers },
                );
                const quickBookItem = response.data.BatchItemResponse;

                if (quickBookItem) {
                  for (const product of newProductsArray) {
                    const matchedItem = quickBookItem.find(
                      (qbProduct) => qbProduct?.Item?.Description == product.id,
                    );
                    if (!matchedItem?.Item?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-entity.acc-service-entity',
                      {
                        data: {
                          product: product.id,
                          accountingServiceId: matchedItem.Item.Id,
                          businessLocation: service.businessLocation.id,
                          isSynced: true,
                          syncToken: '0',
                          type: 'product',
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const product of newProductsArray) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        product: product.id,
                        accountingServiceId: product?.oldProductServiceId,
                        businessLocation: service.businessLocation.id,
                        isSynced: true,
                        syncToken: product?.syncToken,
                        type: 'product',
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const product of newProductsArray) {
                const updatedProduct = await strapi.entityService.findOne(
                  'api::product.product',
                  product.id,
                  {
                    populate: ['accServiceEntities.accServiceConn'],
                  },
                );

                if (!updatedProduct?.accServiceEntities?.length) continue;

                const oldProduct = updatedProduct.accServiceEntities.find(
                  (accService) =>
                    accService.accServiceConn.serviceJson.realmId ===
                    serviceJson.realmId,
                );

                if (!oldProduct?.accountingServiceId) continue;

                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      product: product.id,
                      accountingServiceId: oldProduct.accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct.syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'product',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchProductWithQuickBooks',
          'Failed to Batch Sync product with Quick Books',
          error,
        );
      }
    },
    async syncBatchServiceWithQuickBooks(services, tenantId) {
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
            const newProductsArray = [];
            for (const serviceProduct of services) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    service: serviceProduct?.id,
                    type: 'service',
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::service.service',
                  serviceProduct?.id,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
                const oldProduct = item.accServiceEntities?.map((accService) =>
                  accService?.accServiceConn?.serviceJson?.realmId ===
                  serviceJson.realmId
                    ? accService
                    : null,
                );
                item.oldProductServiceId = oldProduct[0]?.accountingServiceId;
                item.syncToken = oldProduct[0]?.syncToken;
                newProductsArray.push(item);
              }
            }

            if (!newProductsArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newProductsArray.map(async (serviceProduct, index) => {
                  if (serviceProduct?.oldProductServiceId) {
                    return null;
                  }
                  const incomeId = await fetchServiceAccountId(
                    null,
                    serviceProduct,
                    service,
                    'revenue',
                  );
                  const expenseId = await fetchServiceAccountId(
                    null,
                    serviceProduct,
                    service,
                    'cost',
                  );

                  return {
                    bId: index,
                    Item: {
                      Name: serviceProduct.name,
                      IncomeAccountRef: {
                        value: incomeId ?? serviceJson.defaultRevenue,
                      },
                      Type: 'Service',
                      ExpenseAccountRef: {
                        value: expenseId ?? serviceJson.defaultCost,
                      },
                      UnitPrice: serviceProduct.defaultPrice,
                      Description: serviceProduct.id,
                    },
                    operation: 'create',
                  };
                }),
              );
              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const itemData = {
                BatchItemRequest: cleanedBatchItems,
              };
              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  itemData,
                  { headers },
                );
                const quickBookItem = response.data.BatchItemResponse;

                if (quickBookItem) {
                  for (const serviceProduct of newProductsArray) {
                    const matchedItem = quickBookItem.find(
                      (qbProduct) =>
                        qbProduct?.Item?.Description == serviceProduct.id,
                    );
                    if (!matchedItem?.Item?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-entity.acc-service-entity',
                      {
                        data: {
                          service: serviceProduct.id,
                          accountingServiceId: matchedItem.Item.Id,
                          businessLocation: service.businessLocation.id,
                          isSynced: true,
                          syncToken: '0',
                          type: 'service',
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const serviceProduct of newProductsArray) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        service: serviceProduct.id,
                        accountingServiceId: serviceProduct.oldProductServiceId,
                        businessLocation: service.businessLocation.id,
                        isSynced: true,
                        syncToken: serviceProduct.syncToken,
                        type: 'service',
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const serviceProduct of newProductsArray) {
                const updatedServiceProduct =
                  await strapi.entityService.findOne(
                    'api::service.service',
                    serviceProduct.id,
                    {
                      populate: ['accServiceEntities.accServiceConn'],
                    },
                  );

                if (!updatedServiceProduct?.accServiceEntities?.length)
                  continue;

                const oldProduct =
                  updatedServiceProduct.accServiceEntities.find(
                    (accService) =>
                      accService.accServiceConn.serviceJson.realmId ===
                      serviceJson.realmId,
                  );

                if (!oldProduct?.accountingServiceId) continue;

                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      service: serviceProduct.id,
                      accountingServiceId: oldProduct.accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct.syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'service',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchServiceWithQuickBooks',
          'Failed to Batch Sync service with Quick Books',
          error,
        );
      }
    },
    async findOrCreateCompositeProduct(serviceId: ID) {
      const accountingServices = await strapi.entityService.findOne(
        'api::acc-service-conn.acc-service-conn',
        serviceId,
        {
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );
      const serviceJson = accountingServices?.serviceJson as ServiceJsonType;
      const query = `SELECT * FROM Item WHERE Name = '${DEFAULT_SERVICE}'`;
      const quickBooksService = await strapi.service(
        'api::acc-service-conn.acc-service-conn',
      );
      const response = await quickBooksService.quickbooksAccountDetails(
        serviceJson.realmId,
        query,
        serviceJson?.accessToken,
        serviceId,
      );

      if (response?.Item?.length > 0) {
        return await response?.Item[0];
      } else {
        const data = {
          Name: DEFAULT_SERVICE,
          IncomeAccountRef: {
            value: serviceJson.defaultRevenue,
          },
          Type: 'Service',
          ExpenseAccountRef: {
            value: serviceJson.defaultCost,
          },
          UnitPrice: 0,
        };
        try {
          const headers = {
            Authorization: `Bearer ${serviceJson?.accessToken}`,
            accountingServiceId: serviceId,
          };
          const response = await quickBookApi.post(
            `/${serviceJson.realmId}/item`,
            data,
            { headers },
          );
          return await response.data.Item;
        } catch (error) {
          handleError(
            'syncServiceWithQuickBooks',
            'Failed to create service with Quick Books',
            error,
          );
        }
      }
    },
    async findOrCreateCompositeProductXero(serviceId: ID) {
      const accountingServices = await strapi.entityService.findOne(
        'api::acc-service-conn.acc-service-conn',
        serviceId,
        {
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      const serviceJson = accountingServices?.serviceJson as ServiceJsonType;
      let compositeProduct;

      const headers = {
        'Authorization': `Bearer ${serviceJson?.accessToken}`,
        'accountingServiceId': serviceId,
        'Xero-Tenant-Id': serviceJson?.xeroTenantId,
      };

      try {
        // Try to find the item by name using "where"
        const encodedName = encodeURIComponent(`Name=="${DEFAULT_SERVICE}"`);
        const response = await xeroApi.get(`/Items?where=${encodedName}`, {
          headers,
        });

        if (response?.data?.Items?.length > 0) {
          compositeProduct = response.data.Items[0];
        } else {
          // Item not found, so create it
          const data = {
            Code: String(new Date().getTime()),
            Description: DEFAULT_SERVICE,
            PurchaseDetails: {
              UnitPrice: 0,
              COGSAccountCode: '',
              TaxType: 'NONE',
            },
            SalesDetails: {
              UnitPrice: 0,
              AccountCode: serviceJson?.defaultRevenue,
              TaxType: 'NONE',
            },
            Name: DEFAULT_SERVICE,
            IsTrackedAsInventory: false,
            InventoryAssetAccountCode: '',
          };

          const createResponse = await xeroApi.post(
            '/Items',
            { Items: [data] },
            { headers },
          );
          compositeProduct = createResponse?.data?.Items?.[0];
        }
      } catch (error) {
        handleError(
          'syncServiceWithXero',
          'Failed to find or create item in Xero',
          error,
        );
      }

      return compositeProduct;
    },
    async syncBatchClassesWithQuickBooks(classes, tenantId) {
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
            const newClassesArray = [];

            for (const classProduct of classes) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    class: classProduct?.id,
                    type: 'class',
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::class.class',
                  classProduct?.id,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
                const oldProduct = item?.accServiceEntities?.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson.realmId
                      ? accService
                      : null,
                );
                item.oldProductServiceId = oldProduct[0]?.accountingServiceId;
                item.syncToken = oldProduct[0]?.syncToken;
                newClassesArray.push(item);
              }
            }

            if (!newClassesArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newClassesArray.map(async (classProduct, index) => {
                  if (classProduct?.oldProductServiceId) {
                    return null;
                  }
                  const incomeId = await fetchServiceAccountId(
                    null,
                    classProduct,
                    service,
                    'revenue',
                  );
                  const expenseId = await fetchServiceAccountId(
                    null,
                    classProduct,
                    service,
                    'cost',
                  );

                  return {
                    bId: index,
                    Item: {
                      Name: classProduct.name,
                      IncomeAccountRef: {
                        value: incomeId ?? serviceJson.defaultRevenue,
                      },
                      Type: 'Service',
                      ExpenseAccountRef: {
                        value: expenseId ?? serviceJson.defaultCost,
                      },
                      UnitPrice: classProduct.defaultPrice,
                      Description: classProduct.id,
                    },
                    operation: 'create',
                  };
                }),
              );
              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const itemData = {
                BatchItemRequest: cleanedBatchItems,
              };
              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  itemData,
                  { headers },
                );
                const quickBookItem = response.data.BatchItemResponse;

                if (quickBookItem) {
                  for (const serviceProduct of newClassesArray) {
                    const matchedItem = quickBookItem.find(
                      (qbProduct) =>
                        qbProduct?.Item?.Description == serviceProduct.id,
                    );
                    if (!matchedItem?.Item?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-entity.acc-service-entity',
                      {
                        data: {
                          class: serviceProduct.id,
                          accountingServiceId: matchedItem.Item.Id,
                          businessLocation: service.businessLocation.id,
                          isSynced: true,
                          syncToken: '0',
                          type: 'class',
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const serviceProduct of newClassesArray) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        class: serviceProduct.id,
                        accountingServiceId: serviceProduct.oldProductServiceId,
                        businessLocation: service.businessLocation.id,
                        isSynced: true,
                        syncToken: serviceProduct.syncToken,
                        type: 'class',
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const serviceProduct of newClassesArray) {
                const updatedServiceProduct =
                  await strapi.entityService.findOne(
                    'api::class.class',
                    serviceProduct.id,
                    {
                      populate: ['accServiceEntities.accServiceConn'],
                    },
                  );

                if (!updatedServiceProduct?.accServiceEntities?.length)
                  continue;

                const oldProduct =
                  updatedServiceProduct.accServiceEntities.find(
                    (accService) =>
                      accService.accServiceConn.serviceJson.realmId ===
                      serviceJson.realmId,
                  );

                if (!oldProduct?.accountingServiceId) continue;

                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      class: serviceProduct.id,
                      accountingServiceId: oldProduct.accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct.syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'class',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchClassesWithQuickBooks',
          'Failed to Batch Sync classes with Quick Books',
          error,
        );
      }
    },
    async syncClassWithQuickBooks(classId: ID) {
      try {
        //getting all the updated values
        const syncedRealmIds: string[] = [];
        const serviceProduct = await strapi.entityService.findOne(
          'api::class.class',
          classId,
          {
            populate: [
              'revenueChartAccount',
              'revenueChartAccount.accProductMappings',
              'revenueChartCategory',
              'revenueChartCategory.accProductMappings',
              'revenueChartSubcategory',
              'revenueChartSubcategory.accProductMappings',
              'costChartAccount',
              'costChartAccount.accProductMappings',
              'costChartCategory',
              'costChartCategory.accProductMappings',
              'costChartSubcategory',
              'costChartSubcategory.accProductMappings',
              'accServiceEntities',
              'accServiceEntities.accServiceConn',
              'tenant',
            ],
          },
        );
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              tenant: { id: { $eq: serviceProduct.tenant.id } },
            },
            populate: [
              'businessLocation',
              'accProductMappings',
              'accProductMappings.chartAccount',
            ],
          },
        );
        if (!accountingServices?.length) {
          return;
        }

        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'service',
            tenantId: serviceProduct.tenant.id,
            serviceType: 'quickBooks',
          });
        if (!mappingStatus) {
          return new Error(`Please complete the quickBooks mapping.`);
        }

        if (accountingServices?.length) {
          for (const service of accountingServices) {
            const incomeId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'revenue',
            );
            const expenseId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'cost',
            );
            const serviceJson = service?.serviceJson as ServiceJsonType;
            if (serviceJson.realmId) {
              let quickBookItem;
              const data = {
                Name: serviceProduct.name,
                IncomeAccountRef: {
                  value: incomeId ?? serviceJson.defaultRevenue,
                },
                Type: 'Service',
                ExpenseAccountRef: {
                  value: expenseId ?? serviceJson.defaultCost,
                },
                UnitPrice: serviceProduct.defaultPrice,
              };
              const accountingService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    class: classId,
                    serviceType: 'quickBooks',
                    businessLocation: service.businessLocation.id,
                    type: 'class',
                  },
                });
              if (accountingService) {
                data['Id'] = accountingService?.accountingServiceId;
                data['SyncToken'] = accountingService?.syncToken;
              }
              if (!syncedRealmIds.includes(serviceJson?.realmId)) {
                syncedRealmIds.push(serviceJson?.realmId);
                try {
                  const headers = {
                    Authorization: `Bearer ${serviceJson?.accessToken}`,
                    accountingServiceId: service.id,
                  };

                  const response = await quickBookApi.post(
                    `/${serviceJson.realmId}/item`,
                    data,
                    { headers },
                  );
                  quickBookItem = await response.data.Item;
                } catch (error) {
                  handleError(
                    'syncServiceWithQuickBooks',
                    'Failed to create service with Quick Books',
                    error,
                  );
                }
              }
              const updatedAccountingServiceProduct =
                await strapi.entityService.findOne(
                  'api::class.class',
                  classId,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
              const oldProduct =
                updatedAccountingServiceProduct?.accServiceEntities.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson?.realmId
                      ? accService
                      : null,
                );
              if (accountingService?.id && quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: quickBookItem?.SyncToken,
                    },
                  },
                );
              } else if (
                serviceJson.realmId &&
                !accountingService?.id &&
                oldProduct[0]?.accountingServiceId
              ) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      class: classId,
                      accountingServiceId: oldProduct[0].accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct[0].syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'class',
                    },
                  },
                );
              } else if (accountingService?.id && !quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: oldProduct[0].syncToken,
                    },
                  },
                );
              } else {
                if (quickBookItem) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        class: classId,
                        accountingServiceId: quickBookItem?.Id,
                        businessLocation: service.businessLocation.id,
                        syncToken: quickBookItem?.SyncToken,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                        type: 'class',
                      },
                    },
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncServiceWithQuickBooks',
          'Failed to create service with Quick Books -2',
          error,
        );
      }
    },
    async syncBatchMembershipWithQuickBooks(memberships, tenantId) {
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
            const newMembershipsArray = [];
            for (const membershipProduct of memberships) {
              const accountingItemService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    membership: membershipProduct?.id,
                    type: 'membership',
                    businessLocation: service?.businessLocation?.id,
                    serviceType: 'quickBooks',
                    isSynced: true,
                  },
                });

              if (!accountingItemService) {
                const item = await strapi.entityService.findOne(
                  'api::membership.membership',
                  membershipProduct?.id,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
                const oldProduct = item?.accServiceEntities?.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson.realmId
                      ? accService
                      : null,
                );
                item.oldProductServiceId = oldProduct[0]?.accountingServiceId;
                item.syncToken = oldProduct[0]?.syncToken;
                newMembershipsArray.push(item);
              }
            }

            if (!newMembershipsArray.length) continue;
            if (!syncedRealmIds.has(serviceJson.realmId)) {
              syncedRealmIds.add(serviceJson.realmId);
              const batchItems = await Promise.all(
                newMembershipsArray.map(async (membershipProduct, index) => {
                  if (membershipProduct?.oldProductServiceId) {
                    return null;
                  }
                  const incomeId = await fetchServiceAccountId(
                    null,
                    membershipProduct,
                    service,
                    'revenue',
                  );
                  const expenseId = await fetchServiceAccountId(
                    null,
                    membershipProduct,
                    service,
                    'cost',
                  );

                  return {
                    bId: index,
                    Item: {
                      Name: membershipProduct.name,
                      IncomeAccountRef: {
                        value: incomeId ?? serviceJson.defaultRevenue,
                      },
                      Type: 'Service',
                      ExpenseAccountRef: {
                        value: expenseId ?? serviceJson.defaultCost,
                      },
                      UnitPrice: membershipProduct?.price,
                      Description: membershipProduct.id,
                    },
                    operation: 'create',
                  };
                }),
              );
              const cleanedBatchItems = batchItems.filter(
                (item) => item != null,
              );

              const isEmpty = cleanedBatchItems.length === 0;

              const itemData = {
                BatchItemRequest: cleanedBatchItems,
              };
              if (!isEmpty) {
                const headers = {
                  Authorization: `Bearer ${serviceJson.accessToken}`,
                  accountingServiceId: service.id,
                };

                const response = await quickBookApi.post(
                  `/${serviceJson.realmId}/batch`,
                  itemData,
                  { headers },
                );
                const quickBookItem = response.data.BatchItemResponse;

                if (quickBookItem) {
                  for (const membershipProduct of newMembershipsArray) {
                    const matchedItem = quickBookItem.find(
                      (qbProduct) =>
                        qbProduct?.Item?.Description == membershipProduct.id,
                    );
                    if (!matchedItem?.Item?.Id) continue;

                    await strapi.entityService.create(
                      'api::acc-service-entity.acc-service-entity',
                      {
                        data: {
                          membership: membershipProduct.id,
                          accountingServiceId: matchedItem.Item.Id,
                          businessLocation: service.businessLocation.id,
                          isSynced: true,
                          syncToken: '0',
                          type: 'membership',
                          syncDate: new Date(),
                          serviceType: 'quickBooks',
                          accServiceConn: service.id,
                        },
                      },
                    );
                  }
                }
              } else {
                for (const membershipProduct of newMembershipsArray) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        membership: membershipProduct.id,
                        accountingServiceId:
                          membershipProduct.oldProductServiceId,
                        businessLocation: service.businessLocation.id,
                        isSynced: true,
                        syncToken: membershipProduct.syncToken,
                        type: 'membership',
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                      },
                    },
                  );
                }
              }
            } else {
              for (const membershipProduct of newMembershipsArray) {
                const updatedServiceProduct =
                  await strapi.entityService.findOne(
                    'api::membership.membership',
                    membershipProduct.id,
                    {
                      populate: ['accServiceEntities.accServiceConn'],
                    },
                  );

                if (!updatedServiceProduct?.accServiceEntities?.length)
                  continue;

                const oldProduct =
                  updatedServiceProduct.accServiceEntities.find(
                    (accService) =>
                      accService.accServiceConn.serviceJson.realmId ===
                      serviceJson.realmId,
                  );

                if (!oldProduct?.accountingServiceId) continue;

                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      membership: membershipProduct.id,
                      accountingServiceId: oldProduct.accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct.syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'membership',
                    },
                  },
                );
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncBatchClassesWithQuickBooks',
          'Failed to Batch Sync classes with Quick Books',
          error,
        );
      }
    },
    async syncMembershipWithQuickBooks(membershipId: ID) {
      try {
        //getting all the updated values
        const syncedRealmIds: string[] = [];
        const serviceProduct = await strapi.entityService.findOne(
          'api::membership.membership',
          membershipId,
          {
            populate: [
              'revenueChartAccount',
              'revenueChartAccount.accProductMappings',
              'revenueChartCategory',
              'revenueChartCategory.accProductMappings',
              'revenueChartSubcategory',
              'revenueChartSubcategory.accProductMappings',
              'costChartAccount',
              'costChartAccount.accProductMappings',
              'costChartCategory',
              'costChartCategory.accProductMappings',
              'costChartSubcategory',
              'costChartSubcategory.accProductMappings',
              'accServiceEntities',
              'accServiceEntities.accServiceConn',
              'tenant',
            ],
          },
        );
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              tenant: { id: { $eq: serviceProduct.tenant.id } },
            },
            populate: [
              'businessLocation',
              'accProductMappings',
              'accProductMappings.chartAccount',
            ],
          },
        );
        if (!accountingServices?.length) {
          return;
        }

        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'service',
            tenantId: serviceProduct.tenant.id,
            serviceType: 'quickBooks',
          });
        if (!mappingStatus) {
          return new Error(`Please complete the quickBooks mapping.`);
        }

        if (accountingServices?.length) {
          for (const service of accountingServices) {
            const incomeId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'revenue',
            );
            const expenseId = await fetchServiceAccountId(
              null,
              serviceProduct,
              service,
              'cost',
            );
            const serviceJson = service?.serviceJson as ServiceJsonType;
            if (serviceJson.realmId) {
              let quickBookItem;
              const data = {
                Name: serviceProduct.name,
                IncomeAccountRef: {
                  value: incomeId ?? serviceJson.defaultRevenue,
                },
                Type: 'Service',
                ExpenseAccountRef: {
                  value: expenseId ?? serviceJson.defaultCost,
                },
                UnitPrice: serviceProduct?.price,
              };
              const accountingService = await strapi.db
                .query('api::acc-service-entity.acc-service-entity')
                .findOne({
                  where: {
                    membership: membershipId,
                    serviceType: 'quickBooks',
                    businessLocation: service.businessLocation.id,
                    type: 'membership',
                  },
                });
              if (accountingService) {
                data['Id'] = accountingService?.accountingServiceId;
                data['SyncToken'] = accountingService?.syncToken;
              }
              if (!syncedRealmIds.includes(serviceJson?.realmId)) {
                syncedRealmIds.push(serviceJson?.realmId);
                try {
                  const headers = {
                    Authorization: `Bearer ${serviceJson?.accessToken}`,
                    accountingServiceId: service.id,
                  };

                  const response = await quickBookApi.post(
                    `/${serviceJson.realmId}/item`,
                    data,
                    { headers },
                  );
                  quickBookItem = await response.data.Item;
                } catch (error) {
                  handleError(
                    'syncServiceWithQuickBooks',
                    'Failed to create service with Quick Books',
                    error,
                  );
                }
              }
              const updatedAccountingServiceProduct =
                await strapi.entityService.findOne(
                  'api::membership.membership',
                  membershipId,
                  {
                    populate: [
                      'revenueChartAccount',
                      'revenueChartAccount.accProductMappings',
                      'revenueChartCategory',
                      'revenueChartCategory.accProductMappings',
                      'revenueChartSubcategory',
                      'revenueChartSubcategory.accProductMappings',
                      'costChartAccount',
                      'costChartAccount.accProductMappings',
                      'costChartCategory',
                      'costChartCategory.accProductMappings',
                      'costChartSubcategory',
                      'costChartSubcategory.accProductMappings',
                      'accServiceEntities',
                      'accServiceEntities.accServiceConn',
                      'tenant',
                    ],
                  },
                );
              const oldProduct =
                updatedAccountingServiceProduct?.accServiceEntities.map(
                  (accService) =>
                    accService?.accServiceConn?.serviceJson?.realmId ===
                    serviceJson?.realmId
                      ? accService
                      : null,
                );
              if (accountingService?.id && quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: quickBookItem?.SyncToken,
                    },
                  },
                );
              } else if (
                serviceJson.realmId &&
                !accountingService?.id &&
                oldProduct[0]?.accountingServiceId
              ) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      membership: membershipId,
                      accountingServiceId: oldProduct[0].accountingServiceId,
                      businessLocation: service.businessLocation.id,
                      syncToken: oldProduct[0].syncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                      accServiceConn: service.id,
                      type: 'membership',
                    },
                  },
                );
              } else if (accountingService?.id && !quickBookItem) {
                await strapi.entityService.update(
                  'api::acc-service-entity.acc-service-entity',
                  accountingService?.id,
                  {
                    data: {
                      syncDate: new Date(),
                      syncToken: oldProduct[0].syncToken,
                    },
                  },
                );
              } else {
                if (quickBookItem) {
                  await strapi.entityService.create(
                    'api::acc-service-entity.acc-service-entity',
                    {
                      data: {
                        membership: membershipId,
                        accountingServiceId: quickBookItem?.Id,
                        businessLocation: service.businessLocation.id,
                        syncToken: quickBookItem?.SyncToken,
                        isSynced: true,
                        syncDate: new Date(),
                        serviceType: 'quickBooks',
                        accServiceConn: service.id,
                        type: 'membership',
                      },
                    },
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        handleError(
          'syncServiceWithQuickBooks',
          'Failed to create service with Quick Books -2',
          error,
        );
      }
    },
    async syncBatchClassesWithXero(classes, tenantId) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (const accountingService of accountingServices) {
        const newServicesArray = [];
        for (const classService of classes) {
          const accountingItemService = await strapi.db
            .query('api::acc-service-entity.acc-service-entity')
            .findOne({
              where: {
                class: classService?.id,
                type: 'class',
                businessLocation: accountingService?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingItemService) {
            newServicesArray.push(classService);
          }
        }

        const headers = {
          'Authorization': `Bearer ${accountingService?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingService?.id,
          'Xero-Tenant-Id': accountingService?.serviceJson?.xeroTenantId,
        };

        // Process services in batches of 50
        const serviceBatches = [];
        for (let i = 0; i < newServicesArray.length; i += 50) {
          serviceBatches.push(newServicesArray.slice(i, i + 50));
        }

        for (const batch of serviceBatches) {
          const itemData = {
            Items: await Promise.all(
              batch.map(async (classService) => {
                const incomeId = await fetchServiceAccountId(
                  classService,
                  null,
                  accountingService,
                  'revenue',
                );
                return {
                  Code: classService?.classId,
                  Description: classService?.description ?? classService?.name,
                  PurchaseDetails: {
                    UnitPrice: Number(classService?.defaultPrice),
                    COGSAccountCode: '',
                    TaxType: 'NONE',
                  },
                  SalesDetails: {
                    UnitPrice: Number(classService?.defaultPrice),
                    AccountCode:
                      incomeId ||
                      accountingService?.serviceJson?.defaultRevenue,
                    TaxType: 'NONE',
                  },
                  Name:
                    classService?.name?.length > 50
                      ? classService.name.slice(0, 50)
                      : classService.name,
                  IsTrackedAsInventory: false,
                  InventoryAssetAccountCode: '',
                };
              }),
            ),
          };

          try {
            if (itemData?.Items?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              for (const classService of batch) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      class: classService.id,
                      accountingServiceId: response?.data?.Items.find(
                        (item) => item.Code == classService.classId,
                      )?.ItemID,
                      businessLocation: accountingService?.businessLocation?.id,
                      isSynced: true,
                      syncToken: '0',
                      type: 'class',
                      syncDate: new Date(),
                      serviceType: 'xero',
                      accServiceConn: accountingService?.id,
                    },
                  },
                );
              }
            }
          } catch (error) {
            handleError(
              'syncServiceWithXero',
              'Failed to Batch Sync Services with Xero',
              error,
            );
          }
        }
      }
    },
    async syncBatchMembershipWithXero(memberships, tenantId) {
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: { id: { $eq: tenantId } },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      for (const accountingService of accountingServices) {
        const newServicesArray = [];
        for (const membership of memberships) {
          const accountingItemService = await strapi.db
            .query('api::acc-service-entity.acc-service-entity')
            .findOne({
              where: {
                membership: membership?.id,
                type: 'membership',
                businessLocation: accountingService?.businessLocation?.id,
                serviceType: 'xero',
                isSynced: true,
              },
            });

          if (!accountingItemService) {
            newServicesArray.push(membership);
          }
        }

        const headers = {
          'Authorization': `Bearer ${accountingService?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingService?.id,
          'Xero-Tenant-Id': accountingService?.serviceJson?.xeroTenantId,
        };

        // Process services in batches of 50
        const serviceBatches = [];
        for (let i = 0; i < newServicesArray.length; i += 50) {
          serviceBatches.push(newServicesArray.slice(i, i + 50));
        }

        for (const batch of serviceBatches) {
          const itemData = {
            Items: await Promise.all(
              batch.map(async (membership) => {
                const incomeId = await fetchServiceAccountId(
                  membership,
                  null,
                  accountingService,
                  'revenue',
                );
                return {
                  Code: membership?.membershipId,
                  Description: membership?.description ?? membership?.name,
                  PurchaseDetails: {
                    UnitPrice: Number(membership?.price),
                    COGSAccountCode: '',
                    TaxType: 'NONE',
                  },
                  SalesDetails: {
                    UnitPrice: Number(membership?.price),
                    AccountCode:
                      incomeId ||
                      accountingService?.serviceJson?.defaultRevenue,
                    TaxType: 'NONE',
                  },
                  Name:
                    membership?.name?.length > 50
                      ? membership.name.slice(0, 50)
                      : membership.name,
                  IsTrackedAsInventory: false,
                  InventoryAssetAccountCode: '',
                };
              }),
            ),
          };

          try {
            if (itemData?.Items?.length === 0) {
              continue;
            }
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              for (const membership of batch) {
                await strapi.entityService.create(
                  'api::acc-service-entity.acc-service-entity',
                  {
                    data: {
                      membership: membership.id,
                      accountingServiceId: response?.data?.Items.find(
                        (item) => item.Code == membership.membershipId,
                      )?.ItemID,
                      businessLocation: accountingService?.businessLocation?.id,
                      isSynced: true,
                      syncToken: '0',
                      type: 'membership',
                      syncDate: new Date(),
                      serviceType: 'xero',
                      accServiceConn: accountingService?.id,
                    },
                  },
                );
              }
            }
          } catch (error) {
            handleError(
              'syncServiceWithXero',
              'Failed to Batch Sync Services with Xero',
              error,
            );
          }
        }
      }
    },
    async syncClassesWithXero(
      classId: ID,
      operationName: AccountingserviceOperation,
    ) {
      const classService = await strapi.entityService.findOne(
        'api::class.class',
        classId,
        {
          populate: [
            'revenueChartAccount',
            'revenueChartAccount.accProductMappings',
            'revenueChartCategory',
            'revenueChartCategory.accProductMappings',
            'revenueChartSubcategory',
            'revenueChartSubcategory.accProductMappings',
            'costChartAccount',
            'costChartAccount.accProductMappings',
            'costChartCategory',
            'costChartCategory.accProductMappings',
            'costChartSubcategory',
            'costChartSubcategory.accProductMappings',
            'accServiceEntities',
            'accServiceEntities.accServiceConn',
            'tenant',
          ],
        },
      );
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: {
              id: {
                $eq: classService.tenant.id,
              },
            },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      const accountingMappingService = await strapi.service(
        'api::acc-product-mapping.acc-product-mapping',
      );
      const mappingStatus = await accountingMappingService.defaultMappingStatus(
        {
          entityType: 'service',
          tenantId: classService.tenant.id,
          serviceType: 'xero',
        },
      );

      if (!mappingStatus) {
        return new Error(`Please complete the quickBooks mapping.`);
      }

      if (!accountingServices?.length) {
        return;
      }

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingItemService = await strapi.db
          .query('api::acc-service-entity.acc-service-entity')
          .findOne({
            where: {
              class: classService?.id,
              type: 'service',
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });

        const incomeId = await fetchServiceAccountId(
          classService,
          null,
          accountingServices[index],
          'revenue',
        );

        const itemData = {
          Items: [
            {
              Code: classService?.classId,
              Description: classService?.description ?? classService?.name,
              PurchaseDetails: {
                UnitPrice: Number(classService?.defaultPrice),
                COGSAccountCode: '',
                TaxType: 'NONE',
              },
              SalesDetails: {
                UnitPrice: Number(classService?.defaultPrice),
                AccountCode:
                  incomeId ?? classService?.serviceJson?.defaultRevenue,
                TaxType: 'NONE',
              },
              Name:
                classService?.name?.length > 50
                  ? classService.name.slice(0, 50)
                  : classService.name,
              IsTrackedAsInventory: false,
              InventoryAssetAccountCode: '',
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
          if (operationName === 'update' && accountingItemService) {
            // Update existing item in Xero
            const updateItemId = accountingItemService.accountingServiceId;
            const response = await xeroApi.post(
              `/Items/${updateItemId}`,
              itemData,
              { headers },
            );

            if (response) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingItemService.id,
                {
                  data: {
                    syncToken: response?.data?.Items[0]?.UpdatedDateUTC,
                    syncDate: new Date(),
                  },
                },
              );
            }
          } else if (!accountingItemService) {
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    class: classId,
                    accountingServiceId: response?.data?.Items[0]?.ItemID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncToken: '0',
                    type: 'class',
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
            'syncServiceWithXero',
            'Failed to Sync Service with Xero',
            error,
          );
        }
      }
    },
    async syncMembershipsWithXero(
      membershipId: ID,
      operationName: AccountingserviceOperation,
    ) {
      const membership = await strapi.entityService.findOne(
        'api::membership.membership',
        membershipId,
        {
          populate: [
            'revenueChartAccount',
            'revenueChartAccount.accProductMappings',
            'revenueChartCategory',
            'revenueChartCategory.accProductMappings',
            'revenueChartSubcategory',
            'revenueChartSubcategory.accProductMappings',
            'costChartAccount',
            'costChartAccount.accProductMappings',
            'costChartCategory',
            'costChartCategory.accProductMappings',
            'costChartSubcategory',
            'costChartSubcategory.accProductMappings',
            'accServiceEntities',
            'accServiceEntities.accServiceConn',
            'tenant',
          ],
        },
      );
      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            tenant: {
              id: {
                $eq: membership.tenant.id,
              },
            },
          },
          populate: [
            'businessLocation',
            'accProductMappings',
            'accProductMappings.chartAccount',
          ],
        },
      );

      const accountingMappingService = await strapi.service(
        'api::acc-product-mapping.acc-product-mapping',
      );
      const mappingStatus = await accountingMappingService.defaultMappingStatus(
        {
          entityType: 'service',
          tenantId: membership.tenant.id,
          serviceType: 'xero',
        },
      );

      if (!mappingStatus) {
        return new Error(`Please complete the quickBooks mapping.`);
      }

      if (!accountingServices?.length) {
        return;
      }

      for (let index = 0; index < accountingServices?.length; index++) {
        const accountingItemService = await strapi.db
          .query('api::acc-service-entity.acc-service-entity')
          .findOne({
            where: {
              membership: membership?.id,
              type: 'service',
              businessLocation: accountingServices[index]?.businessLocation?.id,
              serviceType: 'xero',
              isSynced: true,
            },
          });

        const incomeId = await fetchServiceAccountId(
          membership,
          null,
          accountingServices[index],
          'revenue',
        );

        const itemData = {
          Items: [
            {
              Code: membership?.membershipId,
              Description: membership?.description ?? membership?.name,
              PurchaseDetails: {
                UnitPrice: Number(membership?.price),
                COGSAccountCode: '',
                TaxType: 'NONE',
              },
              SalesDetails: {
                UnitPrice: Number(membership?.price),
                AccountCode:
                  incomeId ?? membership?.serviceJson?.defaultRevenue,
                TaxType: 'NONE',
              },
              Name:
                membership?.name?.length > 50
                  ? membership.name.slice(0, 50)
                  : membership.name,
              IsTrackedAsInventory: false,
              InventoryAssetAccountCode: '',
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
          if (operationName === 'update' && accountingItemService) {
            // Update existing item in Xero
            const updateItemId = accountingItemService.accountingServiceId;
            const response = await xeroApi.post(
              `/Items/${updateItemId}`,
              itemData,
              { headers },
            );

            if (response) {
              await strapi.entityService.update(
                'api::acc-service-entity.acc-service-entity',
                accountingItemService.id,
                {
                  data: {
                    syncToken: response?.data?.Items[0]?.UpdatedDateUTC,
                    syncDate: new Date(),
                  },
                },
              );
            }
          } else if (!accountingItemService) {
            const response = await xeroApi.post(`/Items`, itemData, {
              headers,
            });
            if (response) {
              await strapi.entityService.create(
                'api::acc-service-entity.acc-service-entity',
                {
                  data: {
                    membership: membershipId,
                    accountingServiceId: response?.data?.Items[0]?.ItemID,
                    businessLocation:
                      accountingServices[index]?.businessLocation?.id,
                    isSynced: true,
                    syncToken: '0',
                    type: 'membership',
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
            'syncServiceWithXero',
            'Failed to Sync Service with Xero',
            error,
          );
        }
      }
    },
  }),
);
