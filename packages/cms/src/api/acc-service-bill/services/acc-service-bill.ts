/**
 * acc-service-bill service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import dayjs from 'dayjs';
import { handleError } from '../../../graphql/helpers/errors';
import { getTaxAmount } from '../../helpers/getTaxAmount';
import quickBookApi from '../../helpers/quickBooksApi';
import xeroApi from '../../helpers/xeroApi';
import { ServiceJsonType } from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-service-bill.acc-service-bill',
  ({ strapi }) => ({
    async syncBillWithXero(orderId: ID) {
      const sellingOrder = await strapi.entityService.findOne(
        'api::order.order',
        orderId,
        {
          populate: [
            'businessLocation',
            'dealTransactions',
            'dealTransactions.accServiceTxn',
            'dealTransactions.paymentMethod.accProductMappings',
            'products',
            'products.product',
            'products.tax',
            'products.product.product',
            'products.taxCollection.taxes',
            'contact',
            'company',
            'company.accServiceVendors',
            'contact.accServiceContact',
            'services',
            'services.tax',
            'services.service',
            'services.service.serviceLocationInfo',
            'services.service.serviceLocationInfo.service',
            'services.taxCollection.taxes',
            'tenant',
          ],
        },
      );
      if (sellingOrder?.total == 0) {
        return;
      }
      if (sellingOrder?.billDeletetion) {
        return;
      }

      if (
        (sellingOrder.status == 'received' &&
          sellingOrder.type == 'purchase') ||
        (sellingOrder.status == 'shipped' && sellingOrder.type == 'purchase')
      ) {
        const businessLocationId = sellingOrder?.businessLocation?.id;

        if (!sellingOrder?.billCreation) {
          return;
        }

        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'xero',
              },
              businessLocation: {
                id: {
                  $eq: Number(businessLocationId),
                },
              },
            },
            populate: ['businessLocation', 'tenant', 'tenant.accServiceTrack'],
          },
        );
        if (!accountingServices?.length) {
          return;
        }

        const xeroPurchaseOrder = await strapi.entityService.findMany(
          'api::acc-service-bill.acc-service-bill',
          {
            filters: {
              serviceType: {
                $eq: 'xero',
              },
              sellingOrder: {
                id: {
                  $eq: Number(orderId),
                },
              },
            },
          },
        );

        const headers = {
          'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.accessToken}`,
          'accountingServiceId': accountingServices[0]?.id,
          'Xero-Tenant-Id': accountingServices[0]?.serviceJson?.xeroTenantId,
        };

        if (xeroPurchaseOrder?.length > 0) {
          for (
            let index = 0;
            index < sellingOrder?.dealTransactions?.length;
            index++
          ) {
            const dealTransaction = sellingOrder?.dealTransactions[index];
            const paymentMethodMapping = sellingOrder?.dealTransactions[
              index
            ]?.paymentMethod?.accProductMappings?.find(
              (mapping) => mapping?.accountingServiceType === 'xero',
            );

            if (
              dealTransaction.status === 'Paid' &&
              !dealTransaction?.accServiceTxn
            ) {
              const paymentData = {
                Invoice: {
                  InvoiceID: xeroPurchaseOrder?.[0]?.accountingServiceId,
                },
                Account: {
                  Code:
                    paymentMethodMapping?.serviceAccountId ||
                    accountingServices[0]?.serviceJson?.['depositToAccount'],
                },
                Date: new Date().toISOString(),
                Amount: dealTransaction?.paid,
              };

              try {
                const paymentRespone = await xeroApi.post(
                  `/Payments`,
                  paymentData,
                  { headers },
                );
                await strapi.entityService.create(
                  'api::acc-service-txn.acc-service-txn',
                  {
                    data: {
                      dealTransaction: dealTransaction?.id,
                      accountingServiceId:
                        paymentRespone?.data?.Payments[0]?.PaymentID,
                      businessLocation: sellingOrder?.businessLocation?.id,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'xero',
                      transactionType: 'billPayment',
                    },
                  },
                );
              } catch (error) {
                handleError(
                  'syncBillWithXero',
                  'Failed to sync create payments With Xero',
                  error,
                );
              }
            }
          }
        } else {
          const products = [];
          const services = [];
          for (let index = 0; index < sellingOrder?.products?.length; index++) {
            const taxRate = sellingOrder?.products[index]?.tax?.rate
              ? sellingOrder?.products[index]?.tax?.rate
              : sellingOrder?.products?.taxCollection?.taxes?.reduce(
                  (totalTax, tax) => totalTax + tax?.rate,
                  0,
                );
            products[index] = {
              quantity: sellingOrder?.products[index]?.quantity,
              productId:
                sellingOrder?.products[index]?.product?.product?.productId,
              price: sellingOrder?.products[index]?.price,
              tax: taxRate,
            };
          }
          for (let index = 0; index < sellingOrder?.services?.length; index++) {
            const taxRate = sellingOrder?.services[index]?.tax?.rate
              ? sellingOrder?.services[index]?.tax?.rate
              : sellingOrder?.services?.taxCollection?.taxes?.reduce(
                  (totalTax, tax) => totalTax + tax?.rate,
                  0,
                );
            services[index] = {
              serviceId:
                sellingOrder?.services[index]?.service?.serviceLocationInfo
                  ?.service?.serviceId,
              price: sellingOrder?.services[index]?.price,
              tax: taxRate,
              name: sellingOrder?.services[index]?.service?.serviceLocationInfo
                ?.service?.name,
            };
          }

          let accountingServiceVendor;
          if (sellingOrder?.company?.id) {
            accountingServiceVendor = await strapi.entityService.findMany(
              'api::acc-service-vendor.acc-service-vendor',
              {
                filters: {
                  serviceType: {
                    $eq: 'xero',
                  },
                  company: {
                    id: {
                      $eq: Number(sellingOrder?.company?.id),
                    },
                  },
                  businessLocation: {
                    id: {
                      $eq: Number(sellingOrder?.businessLocation?.id),
                    },
                  },
                },
              },
            );
          } else {
            accountingServiceVendor = await strapi.entityService.findMany(
              'api::acc-service-contact.acc-service-contact',
              {
                filters: {
                  serviceType: {
                    $eq: 'xero',
                  },
                  contact: {
                    id: {
                      $eq: Number(sellingOrder?.contact?.id),
                    },
                  },
                  businessLocation: {
                    id: {
                      $eq: Number(sellingOrder?.businessLocation?.id),
                    },
                  },
                },
              },
            );
          }

          const xeroPordutLineItem = products?.map((product) => ({
            ItemCode: product?.productId,
            Quantity: product?.quantity,
            TaxAmount:
              (product?.price * product?.quantity * product?.tax) / 100,
            UnitAmount: product?.price,
            TaxType: 'NONE',
            Tracking: [
              {
                TrackingCategoryID:
                  accountingServices[0]?.['tenant']?.accServiceTrack?.[0]
                    ?.accountingServiceId,
                TrackingOptionID: accountingServices[0]?.serviceJson?.['class'],
              },
            ],
          }));

          const billData = {
            Invoices: [
              {
                Type: 'ACCPAY',
                Contact: {
                  ContactID: accountingServiceVendor?.[0]?.accountingServiceId,
                },
                Date: new Date().toISOString(),
                DueDate: new Date().toISOString(),
                LineItems: [...xeroPordutLineItem],
                Status: 'AUTHORISED',
                Reference: sellingOrder?.orderId
                  ? `CaratIQ Order - ${sellingOrder.orderId}`
                  : 'CaratIQ Order',
              },
            ],
          };

          try {
            const billResponse = await xeroApi.post(`/Invoices`, billData, {
              headers,
            });
            if (billResponse?.data?.Invoices[0]?.InvoiceID) {
              await strapi.entityService.create(
                'api::acc-service-bill.acc-service-bill',
                {
                  data: {
                    sellingOrder: sellingOrder?.id,
                    accountingServiceId:
                      billResponse?.data?.Invoices[0]?.InvoiceID,
                    isSynced: true,
                    syncDate: new Date(),
                    serviceType: 'xero',
                  },
                },
              );
            }

            for (
              let index = 0;
              index < sellingOrder?.dealTransactions?.length;
              index++
            ) {
              const dealTransaction = sellingOrder?.dealTransactions[index];
              const paymentMethodMapping = sellingOrder?.dealTransactions[
                index
              ]?.paymentMethod?.accProductMappings?.find(
                (mapping) => mapping?.accountingServiceType === 'xero',
              );

              if (
                dealTransaction?.paid === 0 &&
                dealTransaction.status !== 'Paid'
              ) {
                return;
              }

              const paymentData = {
                Invoice: {
                  InvoiceID: billResponse?.data?.Invoices[0]?.InvoiceID,
                },
                Account: {
                  Code:
                    paymentMethodMapping?.serviceAccountId ||
                    accountingServices[0]?.serviceJson?.['depositToAccount'],
                },
                Date: new Date().toISOString(),
                Amount: dealTransaction?.paid,
              };

              try {
                const paymentRespone = await xeroApi.post(
                  `/Payments`,
                  paymentData,
                  { headers },
                );
                await strapi.entityService.create(
                  'api::acc-service-txn.acc-service-txn',
                  {
                    data: {
                      dealTransaction: dealTransaction?.id,
                      accountingServiceId:
                        paymentRespone?.data?.Payments[0]?.PaymentID,
                      businessLocation: sellingOrder?.businessLocation?.id,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'xero',
                      transactionType: 'billPayment',
                    },
                  },
                );
              } catch (error) {
                handleError(
                  'syncBillWithXero',
                  'Failed to sync create payments With Xero',
                  error,
                );
              }
            }
            for (
              let index = 0;
              index < sellingOrder?.products?.length;
              index++
            ) {
              const product = sellingOrder?.products[index];
              const entityServices = await strapi.service(
                'api::acc-service-entity.acc-service-entity',
              );
              await entityServices.syncProductWithXero(
                product?.product?.product?.id,
                'update',
              );
            }
          } catch (error) {
            handleError(
              'syncBillWithXero',
              'Failed to create Bill With Xero',
              error,
            );
          }
        }
      }
    },
    async syncBillWithQuickBooks(orderId: ID) {
      try {
        const order = await strapi.entityService.findOne(
          'api::order.order',
          orderId,
          {
            populate: [
              'businessLocation',
              'dealTransactions',
              'dealTransactions.accServiceTxn',
              'products',
              'products.product',
              'products.tax',
              'products.product.product',
              'products.taxCollection.taxes',
              'contact',
              'company',
              'accServiceBills',
              'tenant',
              'services',
              'services.tax',
              'services.service',
              'services.service.serviceLocationInfo',
              'services.service.serviceLocationInfo.service',
              'services.taxCollection.taxes',
              'files',
            ],
          },
        );
        const businessLocationId = order?.businessLocation?.id;
        if (order?.total == 0) {
          return;
        }
        if (order?.billDeletetion) {
          return;
        }
        if (order?.memo && order?.memo > 0) {
          return;
        }
        if (!order?.billCreation) {
          return;
        }
        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'purchaseOrder',
            tenantId: order?.tenant?.id,
            serviceType: 'quickBooks',
          });
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              businessLocation: {
                id: {
                  $eq: Number(businessLocationId),
                },
              },
            },
          },
        );
        const serviceJson = accountingServices[0]
          ?.serviceJson as ServiceJsonType;
        if (!serviceJson?.realmId) {
          return;
        }
        if (!accountingServices?.length || !serviceJson?.realmId) {
          return;
        }
        if (!mappingStatus) {
          return new Error(`Please complete the quick books mapping.`);
        }

        if (
          (order.status == 'received' && order.type == 'purchase') ||
          (order.status == 'shipped' && order.type == 'purchase')
        ) {
          let accountingServiceVendor;
          if (order?.company?.id) {
            accountingServiceVendor = await strapi.db
              .query('api::acc-service-vendor.acc-service-vendor')
              .findOne({
                where: {
                  company: order?.company?.id,
                  serviceType: 'quickBooks',
                  businessLocation: businessLocationId,
                },
              });
          } else {
            accountingServiceVendor = await strapi.db
              .query('api::acc-service-vendor.acc-service-vendor')
              .findOne({
                where: {
                  contact: order?.contact?.id,
                  serviceType: 'quickBooks',
                  businessLocation: businessLocationId,
                },
              });
          }
          let products = [];
          let services = [];
          if (order?.products?.length) {
            if (!accountingServices?.[0]?.isProductNotSynced) {
              products = await Promise.all(
                order.products.map(async (product) => {
                  const accountingProduct = await strapi.db
                    .query('api::acc-service-entity.acc-service-entity')
                    .findOne({
                      where: {
                        product: product.product.product.id,
                        serviceType: 'quickBooks',
                        businessLocation: businessLocationId,
                      },
                    });
                  return {
                    DetailType: 'ItemBasedExpenseLineDetail',
                    Amount:
                      product.price * product.quantity +
                      getTaxAmount(product, false, order?.points),
                    ItemBasedExpenseLineDetail: {
                      ItemRef: {
                        value: accountingProduct?.accountingServiceId,
                      },
                      Qty: product.quantity,
                      UnitPrice:
                        product.price +
                        getTaxAmount(product, true, order?.points),
                      BillableStatus: 'NotBillable',
                      TaxCodeRef: {
                        value: 'NON',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            } else {
              if (!serviceJson?.purchaseProductAccountingService) {
                return;
              }
              products = await Promise.all(
                order.products.map(async (product) => {
                  return {
                    DetailType: 'ItemBasedExpenseLineDetail',
                    Amount:
                      product.price * product.quantity +
                      getTaxAmount(product, false, order?.points),
                    Description:
                      product?.product?.product?.name ||
                      product?.product?.product?.productId,
                    ItemBasedExpenseLineDetail: {
                      ItemRef: {
                        value: serviceJson?.purchaseProductAccountingService,
                      },

                      UnitPrice:
                        product.price +
                        getTaxAmount(product, true, order?.points),
                      Qty: product.quantity,
                      BillableStatus: 'NotBillable',
                      TaxCodeRef: {
                        value: 'NON',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            }
          }
          if (order?.services?.length) {
            if (!accountingServices?.[0]?.isServiceNotSynced) {
              services = await Promise.all(
                order.services.map(async (service) => {
                  const accountingProduct = await strapi.db
                    .query('api::acc-service-entity.acc-service-entity')
                    .findOne({
                      where: {
                        service: service.service.serviceLocationInfo.service.id,
                        serviceType: 'quickBooks',
                        businessLocation: businessLocationId,
                      },
                    });
                  return {
                    Amount:
                      service.price * service.quantity +
                      getTaxAmount(service, false, order?.points),
                    DetailType: 'ItemBasedExpenseLineDetail',
                    ItemBasedExpenseLineDetail: {
                      ItemRef: {
                        value: accountingProduct?.accountingServiceId,
                      },
                      Qty: service.quantity,
                      UnitPrice:
                        service.price +
                        getTaxAmount(service, true, order?.points),
                      TaxCodeRef: {
                        value: 'NON',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            } else {
              if (!serviceJson?.purchaseServiceAccountingService) {
                return;
              }
              services = await Promise.all(
                order.services.map(async (service) => {
                  return {
                    Amount:
                      service.price * service.quantity +
                      getTaxAmount(service, false, order?.points),
                    DetailType: 'ItemBasedExpenseLineDetail',
                    Description:
                      service?.service?.serviceLocationInfo?.service?.name ||
                      service?.service?.serviceLocationInfo?.service?.serviceId,
                    ItemBasedExpenseLineDetail: {
                      ItemRef: {
                        value: serviceJson?.purchaseServiceAccountingService,
                      },
                      Qty: service.quantity,
                      UnitPrice:
                        service.price +
                        getTaxAmount(service, true, order?.points),
                      TaxCodeRef: {
                        value: 'NON',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            }
          }

          const bill = order.accServiceBills.filter(
            (bill) => bill.serviceType == 'quickBooks',
          )[0];
          let paidAmount = 0;
          order.dealTransactions.map((item) => {
            if (item.status === 'Paid') {
              paidAmount += item.paid;
            }
          });
          const today = dayjs().format('YYYY-MM-DD');
          // let quickBooksBill;
          const data = {
            VendorRef: {
              value: accountingServiceVendor?.accountingServiceId,
            },
            Line: [
              ...products,
              ...services,
              {
                DetailType: 'ItemBasedExpenseLineDetail',
                Amount: `${-paidAmount}`,
                ItemBasedExpenseLineDetail: {
                  ItemRef: {
                    value: serviceJson.prePaymentServicePurchase,
                  },
                  Qty: 1,
                  BillableStatus: 'NotBillable',
                  TaxCodeRef: {
                    value: 'NON',
                  },
                  ClassRef: {
                    value: serviceJson.class,
                  },
                },
              },
              {
                DetailType: 'ItemBasedExpenseLineDetail',
                Amount: `${-order?.points}`,
                ItemBasedExpenseLineDetail: {
                  ItemRef: {
                    value:
                      serviceJson?.defaultPointDiscountPurchase ||
                      serviceJson.prePaymentServicePurchase,
                  },
                  Qty: 1,
                  TaxCodeRef: {
                    value: 'NON',
                  },
                  ClassRef: {
                    value: serviceJson.class,
                  },
                },
              },
            ],
            DocNumber: order?.orderId,
            TxnDate: today,
            DepartmentRef: {
              value: serviceJson.department,
            },
          };

          if (bill) {
            data['Id'] = bill.accountingServiceId;
            data['SyncToken'] = bill.syncToken;
          }
          const headers = {
            Authorization: `Bearer ${serviceJson.accessToken}`,
            accountingServiceId: accountingServices[0]?.id,
          };
          let quickBooksBill;
          try {
            const response = await quickBookApi.post(
              `/${serviceJson.realmId}/bill`,
              data,
              { headers },
            );
            if (!response?.data?.Bill) {
              return;
            }
            quickBooksBill = response.data.Bill;
          } catch (error) {
            handleError(
              'syncBillWithQuickBooks',
              'Failed to create Bill With QuickBooks',
              error,
            );
          }

          let newBill;
          if (bill) {
            await strapi.entityService.update(
              'api::acc-service-bill.acc-service-bill',
              bill.id,
              {
                data: {
                  syncToken: quickBooksBill.SyncToken,
                  syncDate: new Date(),
                },
              },
            );
          } else {
            newBill = await strapi.entityService.create(
              'api::acc-service-bill.acc-service-bill',
              {
                data: {
                  accountingServiceId: quickBooksBill.Id,
                  syncToken: quickBooksBill.SyncToken,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'quickBooks',
                  status: 'open',
                  sellingOrder: orderId,
                },
              },
            );
          }

          if (order?.files?.length) {
            const orderService = await strapi.service(
              'api::acc-service-order.acc-service-order',
            );
            await orderService.syncAttachmentsWithQuickBooks(
              orderId,
              bill ? bill.id : newBill?.id,
              'bill',
            );
          }
        }
      } catch (error) {
        handleError(
          'syncBillWithQuickBooks',
          'Failed to create Bill With QuickBooks',
          error,
        );
      }
    },
  }),
);
