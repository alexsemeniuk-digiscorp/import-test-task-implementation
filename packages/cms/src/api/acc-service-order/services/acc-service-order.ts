/**
 * acc-service-order service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import axios from 'axios';
import dayjs from 'dayjs';
import FormData from 'form-data';
import { handleError } from '../../../graphql/helpers/errors';
import { DEFAULT_SERVICE } from '../../helpers/constants';
import quickBookApi from '../../helpers/quickBooksApi';
import xeroApi from '../../helpers/xeroApi';
import { ServiceJsonType } from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-service-order.acc-service-order',
  ({ strapi }) => ({
    async syncAttachmentsWithQuickBooks(
      orderId: ID,
      accountingServiceId: ID,
      type: 'invoice' | 'bill',
    ) {
      try {
        const order = await strapi.entityService.findOne(
          'api::order.order',
          orderId,
          {
            populate: ['businessLocation', 'files'],
          },
        );
        let invoiceDetails;
        let accountingBill;
        if (type === 'invoice') {
          invoiceDetails = await strapi.entityService.findOne(
            'api::acc-service-order.acc-service-order',
            accountingServiceId,
            {
              populate: ['accServiceFiles'],
            },
          );
        } else {
          accountingBill = await strapi.entityService.findOne(
            'api::acc-service-bill.acc-service-bill',
            accountingServiceId,
            {
              populate: ['accServiceFiles'],
            },
          );
        }
        if (invoiceDetails || accountingBill) {
          const accountingServices = await strapi.entityService.findMany(
            'api::acc-service-conn.acc-service-conn',
            {
              filters: {
                serviceType: {
                  $eq: 'quickBooks',
                },
                businessLocation: {
                  id: {
                    $eq: Number(order?.businessLocation?.id),
                  },
                },
              },
            },
          );

          if (!accountingServices?.length) {
            return;
          }

          const serviceJson = accountingServices[0]
            ?.serviceJson as ServiceJsonType;
          const attachableHeader = {
            'Authorization': `Bearer ${serviceJson.accessToken}`,
            'Content-Type': 'application/json',
            'accountingServiceId': accountingServices[0].id,
          };

          const existingAttachmentsResponse = await quickBookApi.get(
            `/${serviceJson.realmId}/query?query=${encodeURIComponent(
              invoiceDetails?.accountingServiceId
                ? `SELECT * FROM Attachable WHERE AttachableRef.EntityRef.Type = 'Invoice' AND AttachableRef.EntityRef.Value = '${invoiceDetails?.accountingServiceId}'`
                : `SELECT * FROM Attachable WHERE AttachableRef.EntityRef.Type = 'Bill' AND AttachableRef.EntityRef.Value = '${accountingBill?.accountingServiceId}'`,
            )}`,
            { headers: attachableHeader },
          );

          const existingAttachments =
            existingAttachmentsResponse?.data?.QueryResponse?.Attachable || [];

          // **Step 2: Delete all attachables**
          for (const attachment of existingAttachments) {
            await quickBookApi.post(
              `/${serviceJson.realmId}/attachable?operation=delete`,
              { Id: attachment.Id, SyncToken: attachment.SyncToken },
              { headers: attachableHeader },
            );
          }
          const attachable = invoiceDetails?.accServiceFiles?.length
            ? invoiceDetails?.accServiceFiles
            : accountingBill?.accServiceFiles;
          if (attachable?.length) {
            for (const attachment of attachable) {
              await strapi.entityService.delete(
                'api::acc-service-file.acc-service-file',
                attachment.id,
              );
            }
          }

          if (!order?.files?.length) {
            return false;
          }

          const promises = await order?.files?.map(async (file, index) => {
            const response = await axios.get(file.url, {
              responseType: 'arraybuffer',
            });

            const fileBuffer = response.data;
            const fileName = file.name;

            const form = new FormData();
            form.append(`file_content_${index}`, fileBuffer, {
              filename: fileName,
              contentType: file?.mime,
            });

            const mimeType = file.mime;
            const contentTypes = [
              'application/postscript', // ai, eps
              'text/csv', // csv
              'application/msword', // doc
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
              'image/gif', // gif
              'image/jpeg', // jpeg
              'image/jpg', // jpg
              'application/vnd.oasis.opendocument.spreadsheet', // ods
              'application/pdf', // pdf
              'image/png', // png
              'text/rtf', // rtf
              'image/tiff', // tif
              'text/plain', // txt
              'application/vnd.ms-excel', // xls
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
              'text/xml', // xml
            ];

            if (!contentTypes.includes(mimeType)) {
              throw new Error(`Unsupported image MIME type: ${file.mime}`);
            }
            let quickBookItem;
            try {
              const headers = {
                Authorization: `Bearer ${serviceJson.accessToken}`,
                ...form.getHeaders(),
                accountingServiceId: accountingServices[0].id,
              };

              const response = await quickBookApi.post(
                `/${serviceJson.realmId}/upload`,
                form,
                { headers },
              );
              const attachment = await response.data.AttachableResponse[0]
                .Attachable;
              const attachableId = await attachment.Id;
              const syncToken = await attachment.SyncToken;
              quickBookItem = await quickBookApi.post(
                `/${serviceJson.realmId}/attachable`,
                {
                  SyncToken: syncToken,
                  domain: 'QBO',
                  AttachableRef: [
                    {
                      IncludeOnSend: false,
                      EntityRef: {
                        type: invoiceDetails?.accountingServiceId
                          ? 'Invoice'
                          : 'Bill',
                        value:
                          invoiceDetails?.accountingServiceId ||
                          accountingBill?.accountingServiceId,
                      },
                    },
                  ],
                  sparse: false,
                  Id: attachableId,
                  FileName: file?.name,
                  ContentType: file?.mime,
                },
                { headers: attachableHeader },
              );

              if (invoiceDetails?.id) {
                await strapi.entityService.create(
                  'api::acc-service-file.acc-service-file',
                  {
                    data: {
                      accServiceOrder: invoiceDetails.id,
                      accountingServiceId: quickBookItem.data.Attachable.Id,
                      syncToken: quickBookItem.data.Attachable.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                    },
                  },
                );
              } else {
                await strapi.entityService.create(
                  'api::acc-service-file.acc-service-file',
                  {
                    data: {
                      accServiceBill: accountingBill.id,
                      accountingServiceId: quickBookItem.data.Attachable.Id,
                      syncToken: quickBookItem.data.Attachable.SyncToken,
                      isSynced: true,
                      syncDate: new Date(),
                      serviceType: 'quickBooks',
                    },
                  },
                );
              }

              const inovoiceData = await quickBookApi.get(
                `/${serviceJson.realmId}/query?query=${encodeURIComponent(
                  invoiceDetails?.accountingServiceId
                    ? `SELECT * FROM Invoice WHERE Id = '${invoiceDetails?.accountingServiceId}'`
                    : `SELECT * FROM Bill WHERE Id = '${accountingBill?.accountingServiceId}'`,
                )}`,
                { headers },
              );
              if (invoiceDetails?.id) {
                await strapi.entityService.update(
                  'api::acc-service-order.acc-service-order',
                  invoiceDetails.id,
                  {
                    data: {
                      syncToken:
                        inovoiceData.data.QueryResponse.Invoice[0].SyncToken,
                    },
                  },
                );
              } else {
                await strapi.entityService.update(
                  'api::acc-service-bill.acc-service-bill',
                  accountingBill.id,
                  {
                    data: {
                      syncToken:
                        inovoiceData.data.QueryResponse.Bill[0].SyncToken,
                    },
                  },
                );
              }
            } catch (error) {
              handleError(
                'syncAttachmentsWithQuickBooks',
                'Failed to Sync attachments with Quick Books',
                error,
              );
            }
          });
          await Promise.allSettled(promises);
        }
      } catch (error) {
        handleError(
          'syncAttachmentsWithQuickBooks',
          'Failed to Sync attachments with Quick Books -2',
          error,
        );
      }
    },
    async generateInoviceWithQuickBooks(orderId: ID) {
      const order = await strapi.entityService.findOne(
        'api::order.order',
        orderId,
        {
          populate: [
            'businessLocation',
            'dealTransactions',
            'dealTransactions.accServiceTxns',
            'services.tax',
            'services.service.serviceLocationInfo.service',
            'services.taxCollection.taxes',
            'products.tax',
            'products.taxCollection.taxes',
            'products.product.product',
            'contact',
            'company',
            'accServiceOrders',
            'compositeProducts.tax',
            'compositeProducts.taxCollection.taxes',
            'classes.tax',
            'classes.class.classLocationInfo.class',
            'classes.taxCollection.taxes',
            'memberships.membership',
            'memberships.tax',
            'memberships.taxCollection.taxes',
            'files',
            'return',
          ],
        },
      );
      if (order?.total == 0) {
        return;
      }
      if (order?.memo && order?.memo > 0) {
        return;
      }
      if (order?.billDeletetion) {
        return;
      }
      const invoice = order.accServiceOrders.filter(
        (invoice) => invoice.serviceType == 'quickBooks',
      )[0];
      try {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'quickBooks',
              },
              businessLocation: {
                id: {
                  $eq: Number(order?.businessLocation?.id),
                },
              },
            },
          },
        );
        if (!accountingServices?.length) {
          return;
        }
        if (
          (order?.status === 'shipped' &&
            order?.type != 'purchase' &&
            order?.type != 'tradeIn') ||
          invoice
        ) {
          const serviceJson = accountingServices[0]
            ?.serviceJson as ServiceJsonType;
          if (!serviceJson?.realmId) {
            return;
          }
          let accountingServiceContact;
          if (!accountingServices?.[0]?.isContactNotSynced) {
            if (order?.contact?.id) {
              accountingServiceContact = await strapi.db
                .query('api::acc-service-contact.acc-service-contact')
                .findOne({
                  where: {
                    contact: order.contact.id,
                    serviceType: 'quickBooks',
                    businessLocation: order?.businessLocation?.id,
                  },
                });
            } else {
              accountingServiceContact = await strapi.db
                .query('api::acc-service-contact.acc-service-contact')
                .findOne({
                  where: {
                    company: order.company.id,
                    serviceType: 'quickBooks',
                    businessLocation: order?.businessLocation?.id,
                  },
                });
            }
          } else {
            accountingServiceContact = {
              accountingServiceId: serviceJson?.contactAccountingService,
            };
          }
          let products = [];
          let services = [];
          let compositeProducts = [];
          let classes = [];
          let memberships = [];
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
                        businessLocation: order.businessLocation.id,
                      },
                    });
                  return {
                    Amount: product.price * product.quantity,
                    DetailType: 'SalesItemLineDetail',
                    SalesItemLineDetail: {
                      ItemRef: {
                        value: accountingProduct?.accountingServiceId,
                      },
                      Qty: product.quantity,
                      UnitPrice: product.price,
                      TaxCodeRef: {
                        value: 'TAX',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            } else {
              if (!serviceJson?.productAccountingService) {
                return;
              }
              products = await Promise.all(
                order.products.map(async (product) => {
                  return {
                    DetailType: 'SalesItemLineDetail',
                    Amount: `${product.price * product.quantity}`,
                    Description:
                      product?.product?.product?.name ||
                      product?.product?.product?.productId,
                    SalesItemLineDetail: {
                      ItemRef: {
                        value: serviceJson?.productAccountingService,
                      },
                      Qty: product.quantity,
                      UnitPrice: product.price,
                      TaxCodeRef: {
                        value: 'TAX',
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
                        businessLocation: order.businessLocation.id,
                      },
                    });
                  return {
                    Amount: service.price * service.quantity,
                    DetailType: 'SalesItemLineDetail',
                    SalesItemLineDetail: {
                      ItemRef: {
                        value: accountingProduct?.accountingServiceId,
                      },
                      Qty: service.quantity,
                      UnitPrice: service.price,
                      TaxCodeRef: {
                        value: 'TAX',
                      },
                      ClassRef: {
                        value: serviceJson.class,
                      },
                    },
                  };
                }),
              );
            } else {
              if (!serviceJson?.serviceAccountingService) {
                return;
              }
              services = await Promise.all(
                order.services.map(async (service) => {
                  return {
                    Amount: service.price * service.quantity,
                    DetailType: 'SalesItemLineDetail',
                    Description:
                      service?.service?.serviceLocationInfo?.service?.name ||
                      service?.service?.serviceLocationInfo?.service?.serviceId,
                    SalesItemLineDetail: {
                      ItemRef: {
                        value: serviceJson?.serviceAccountingService,
                      },
                      Qty: service.quantity,
                      UnitPrice: service.price,
                      TaxCodeRef: {
                        value: 'TAX',
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
          if (order?.compositeProducts?.length) {
            compositeProducts = await Promise.all(
              order.compositeProducts.map(async (compositeProduct) => {
                const quickBooksService = await strapi.service(
                  'api::acc-service-entity.acc-service-entity',
                );
                const quickBookProduct =
                  await quickBooksService.findOrCreateCompositeProduct(
                    accountingServices[0].id,
                  );
                return {
                  Amount: compositeProduct.price * compositeProduct.quantity,
                  DetailType: 'SalesItemLineDetail',
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: quickBookProduct?.Id,
                    },
                    Qty: compositeProduct.quantity,
                    UnitPrice: compositeProduct.price,
                    TaxCodeRef: {
                      value: 'TAX',
                    },
                    ClassRef: {
                      value: serviceJson.class,
                    },
                  },
                };
              }),
            );
          }
          if (order?.memberships?.length) {
            memberships = await Promise.all(
              order.memberships.map(async (membership) => {
                const quickBookProduct = await strapi.db
                  .query('api::acc-service-entity.acc-service-entity')
                  .findOne({
                    where: {
                      membership: membership?.membership?.id,
                      serviceType: 'quickBooks',
                      businessLocation: order.businessLocation.id,
                    },
                  });
                return {
                  Amount: membership.price * membership.quantity,
                  DetailType: 'SalesItemLineDetail',
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: quickBookProduct?.accountingServiceId,
                    },
                    Qty: membership.quantity,
                    UnitPrice: membership.price,
                    TaxCodeRef: {
                      value: 'TAX',
                    },
                    ClassRef: {
                      value: serviceJson.class,
                    },
                  },
                };
              }),
            );
          }
          if (order?.classes?.length) {
            classes = await Promise.all(
              order.classes.map(async (classe) => {
                const quickBookProduct = await strapi.db
                  .query('api::acc-service-entity.acc-service-entity')
                  .findOne({
                    where: {
                      class: classe?.class?.classLocationInfo?.class?.id,
                      serviceType: 'quickBooks',
                      businessLocation: order.businessLocation.id,
                    },
                  });
                return {
                  Amount: classe.price * classe.quantity,
                  DetailType: 'SalesItemLineDetail',
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: quickBookProduct?.accountingServiceId,
                    },
                    Qty: classe.quantity,
                    UnitPrice: classe.price,
                    TaxCodeRef: {
                      value: 'TAX',
                    },
                    ClassRef: {
                      value: serviceJson.class,
                    },
                  },
                };
              }),
            );
          }

          let paidAmount = 0;

          order.dealTransactions.map((item) => {
            if (item.status === 'Paid') {
              paidAmount += item.paid;
            }
          });
          const headers = {
            Authorization: `Bearer ${serviceJson.accessToken}`,
            accountingServiceId: accountingServices[0].id,
          };

          const taxService = await strapi.service(
            'api::acc-service-tax.acc-service-tax',
          );
          const taxRef = await taxService.findOrCreateTaxRate(
            Math.floor(
              (order.tax / (order.total + order?.points)) * 100 * 100,
            ) / 100,
            serviceJson.realmId,
            headers,
          );

          const today = dayjs().format('YYYY-MM-DD');
          let quickBookInvoice;
          const data = {
            Line: [
              ...products,
              ...services,
              ...compositeProducts,
              ...memberships,
              ...classes,
              {
                DetailType: 'SalesItemLineDetail',
                Amount: `${-order?.discount}`,
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson?.defaultDiscount,
                  },
                  Qty: 1,
                  TaxCodeRef: {
                    value: 'NON',
                  },
                },
              },
              {
                DetailType: 'SalesItemLineDetail',
                Amount: `${-order?.points}`,
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson?.defaultPointDiscount,
                  },
                  Qty: 1,
                  TaxCodeRef: {
                    value: 'NON',
                  },
                },
              },
              {
                DetailType: 'SalesItemLineDetail',
                Amount: `${-paidAmount}`,
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson.prePaymentService,
                  },
                  Qty: 1,
                  TaxCodeRef: {
                    value: 'NON',
                  },
                },
              },
            ],
            DocNumber: order?.orderId,
            CustomerRef: {
              value: accountingServiceContact?.accountingServiceId,
            },
            TxnTaxDetail: {
              TxnTaxCodeRef: {
                value: taxRef.Id,
              },
              TotalTax: order.tax,
            },
            ClassRef: {
              value: serviceJson.class,
            },
            DepartmentRef: {
              value: serviceJson.department,
            },
            TxnDate: today,
          };

          if (invoice) {
            data['Id'] = invoice.accountingServiceId;
            data['SyncToken'] = invoice.syncToken;
          }
          try {
            const response = await quickBookApi.post(
              `/${serviceJson.realmId}/invoice`,
              data,
              { headers },
            );
            quickBookInvoice = response.data.Invoice;
          } catch (error) {
            // Skip QuickBooks operation if auth expired, don't break the flow
            if (error.name === 'QuickBooksAuthExpiredError') {
              console.log('QuickBooks auth expired, skipping invoice API call');
              return;
            }
            handleError(
              'generateInoviceWithQuickBooks',
              'Failed to generate invocie with Quick Books',
              error,
            );
          }
          if (!quickBookInvoice) {
            return;
          }
          let newInvoice;
          if (invoice) {
            await strapi.entityService.update(
              'api::acc-service-order.acc-service-order',
              invoice.id,
              {
                data: {
                  syncToken: quickBookInvoice?.SyncToken,
                  syncDate: new Date(),
                },
              },
            );
          } else {
            newInvoice = await strapi.entityService.create(
              'api::acc-service-order.acc-service-order',
              {
                data: {
                  sellingOrder: orderId,
                  accountingServiceId: quickBookInvoice?.Id,
                  businessLocation: order?.businessLocation?.id,
                  syncToken: quickBookInvoice?.SyncToken,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'quickBooks',
                },
              },
            );
          }
          if (order.files?.length) {
            const orderService = await strapi.service(
              'api::acc-service-order.acc-service-order',
            );
            await orderService.syncAttachmentsWithQuickBooks(
              orderId,
              invoice ? invoice.id : newInvoice?.id,
              'invoice',
            );
          }
        }
      } catch (error) {
        // Skip QuickBooks operation if auth expired, don't break the flow
        if (error.name === 'QuickBooksAuthExpiredError') {
          console.log(
            'QuickBooks auth expired, skipping invoice generation operation',
          );
          return;
        }
        handleError(
          'generateInoviceWithQuickBooks',
          'Failed to generate invoice with Quick Books -2',
          error,
        );
      }
    },
    async generateInoviceWithXero(orderId: ID) {
      const sellingOrder = await strapi.entityService.findOne(
        'api::order.order',
        orderId,
        {
          populate: [
            'businessLocation',
            'files',
            'products.product.product',
            'contact.accServiceContacts.businessLocation',
            'company.accServiceContacts.businessLocation',
            'products.tax',
            'products.taxCollection',
            'compositeProducts.tax',
            'compositeProducts.taxCollection.taxes',
          ],
        },
      );
      if (sellingOrder?.total == 0) {
        return;
      }
      if (sellingOrder?.billDeletetion) {
        return;
      }
      if (sellingOrder.type === 'purchase' || sellingOrder?.type == 'tradeIn') {
        return;
      }
      const paidTransaction = sellingOrder?.dealTransactions?.filter(
        (txn) => txn?.status === 'Paid',
      );

      if (
        !['incoming', 'preparing', 'ready', 'shipped'].includes(
          sellingOrder?.status,
        ) &&
        !paidTransaction?.length
      ) {
        return;
      }
      const accountingService = await strapi.service(
        'api::acc-service-order.acc-service-order',
      );
      await accountingService.editInvoiceWithXero(orderId);

      const xeroInvoice = await strapi.db
        .query('api::acc-service-order.acc-service-order')
        .findOne({
          where: {
            sellingOrder: orderId,
            serviceType: 'xero',
            isSynced: true,
            businessLocation: sellingOrder?.businessLocation?.id,
          },
        });

      if (!xeroInvoice) {
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
                $eq: Number(sellingOrder?.businessLocation?.id),
              },
            },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      if (sellingOrder?.files?.length) {
        try {
          const attachmentPromises = sellingOrder?.files?.map(async (file) => {
            const fileResponse = await axios.get(file.url, {
              responseType: 'arraybuffer',
            });

            const headers = {
              'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.accessToken}`,
              'accountingServiceId': accountingServices[0]?.id,
              'Xero-Tenant-Id':
                accountingServices[0]?.serviceJson?.xeroTenantId,
              'Content-Type': file.mime,
              'Content-Length': fileResponse.data.length,
            };

            const response = await xeroApi.post(
              `/Invoices/${xeroInvoice?.accountingServiceId}/Attachments/${file.name}?IncludeOnline=true`,
              fileResponse.data,
              { headers },
            );
            return response;
          });

          await Promise.all(attachmentPromises);
        } catch (error) {
          handleError(
            'generateInoviceWithXero',
            'Failed to generate invoice with Xero',
            error,
          );
        }
      }
    },
    async editInvoiceWithXero(orderId: ID) {
      const sellingOrder = await strapi.entityService.findOne(
        'api::order.order',
        orderId,
        {
          populate: [
            'businessLocation',
            'files',
            'products.product.product',
            'dealTransactions.paymentMethod.accProductMappings',
            'contact.accServiceContacts.businessLocation',
            'company.accServiceContacts.businessLocation',
            'products.tax',
            'products.taxCollection',
            'services',
            'services.tax',
            'services.service',
            'services.service.serviceLocationInfo',
            'services.service.serviceLocationInfo.service',
            'services.taxCollection.taxes',
            'compositeProducts.tax',
            'compositeProducts.taxCollection.taxes',
            'classes.tax',
            'classes.class.classLocationInfo.class',
            'classes.taxCollection.taxes',
            'memberships.membership',
            'memberships.tax',
            'memberships.taxCollection.taxes',
          ],
        },
      );
      if (sellingOrder?.total == 0) {
        return;
      }
      if (sellingOrder?.billDeletetion) {
        return;
      }
      const xeroInvoice = await strapi.db
        .query('api::acc-service-order.acc-service-order')
        .findOne({
          where: {
            sellingOrder: orderId,
            serviceType: 'xero',
            isSynced: true,
            businessLocation: sellingOrder?.businessLocation?.id,
          },
        });

      if (!xeroInvoice) {
        const accountingCompanyService = await strapi.service(
          'api::acc-service-txn.acc-service-txn',
        );
        accountingCompanyService.syncDealTransactionWithXero(
          sellingOrder?.dealTransactions[0]?.id,
        );
      } else {
        const accountingServices = await strapi.entityService.findMany(
          'api::acc-service-conn.acc-service-conn',
          {
            filters: {
              serviceType: {
                $eq: 'xero',
              },
              businessLocation: {
                id: {
                  $eq: Number(sellingOrder?.businessLocation?.id),
                },
              },
            },
            populate: ['businessLocation', 'tenant.accServiceTrack'],
          },
        );

        if (!accountingServices?.length) {
          return;
        }

        try {
          const headers = {
            'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.accessToken}`,
            'accountingServiceId': accountingServices[0]?.id,
            'Xero-Tenant-Id': accountingServices[0]?.serviceJson?.xeroTenantId,
          };
          const xeroInvoiceData = await xeroApi.get(
            `/Invoices/${xeroInvoice?.accountingServiceId}`,
            { headers },
          );
          const xeroInvoicePayments =
            xeroInvoiceData?.data?.Invoices[0]?.Payments;

          if (xeroInvoicePayments?.length) {
            for (const payment of xeroInvoicePayments) {
              await xeroApi.post(
                `/Payments/${payment?.PaymentID}`,
                {
                  Status: 'DELETED',
                },
                { headers },
              );
            }
          }

          const products = [];
          const services = [];
          const compositeProducts = [];
          const classes = [];
          const memberships = [];
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
              name: sellingOrder?.products[index]?.product?.product?.name,
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

          for (
            let index = 0;
            index < sellingOrder?.compositeProducts?.length;
            index++
          ) {
            const taxRate = sellingOrder?.compositeProducts[index]?.tax?.rate
              ? sellingOrder?.compositeProducts[index]?.tax?.rate
              : sellingOrder?.compositeProducts?.taxCollection?.taxes?.reduce(
                  (totalTax, tax) => totalTax + tax?.rate,
                  0,
                );
            const compositeProduct = await strapi.service(
              'api::acc-service-entity.acc-service-entity',
            );
            const xeroCompositeProduct =
              await compositeProduct.findOrCreateCompositeProductXero(
                accountingServices[0].id,
              );
            compositeProducts[index] = {
              code: xeroCompositeProduct?.Code,
              price: sellingOrder?.compositeProducts[index]?.price,
              tax: taxRate,
              name: DEFAULT_SERVICE,
            };
          }
          for (let index = 0; index < sellingOrder?.classes?.length; index++) {
            const taxRate = sellingOrder?.classes[index]?.tax?.rate
              ? sellingOrder?.classes[index]?.tax?.rate
              : sellingOrder?.classes?.taxCollection?.taxes?.reduce(
                  (totalTax, tax) => totalTax + tax?.rate,
                  0,
                );
            classes[index] = {
              classId:
                sellingOrder?.classes[index]?.class?.classLocationInfo?.class
                  ?.classId,
              price: sellingOrder?.classes[index]?.price,
              tax: taxRate,
              name: sellingOrder?.classes[index]?.class?.classLocationInfo
                ?.class?.name,
            };
          }

          for (
            let index = 0;
            index < sellingOrder?.memberships?.length;
            index++
          ) {
            const taxRate = sellingOrder?.memberships[index]?.tax?.rate
              ? sellingOrder?.memberships[index]?.tax?.rate
              : sellingOrder?.memberships?.taxCollection?.taxes?.reduce(
                  (totalTax, tax) => totalTax + tax?.rate,
                  0,
                );
            memberships[index] = {
              membershipId:
                sellingOrder?.memberships[index]?.membership?.membershipId,
              price: sellingOrder?.memberships[index]?.price,
              tax: taxRate,
              name: sellingOrder?.memberships[index]?.membership?.name,
            };
          }
          const discountPercentage =
            sellingOrder?.discount / sellingOrder?.subTotal;
          const productLineItems = products?.map((product) => ({
            ItemCode: product?.productId,
            Quantity: product?.quantity,
            Description: product?.name,
            TaxAmount:
              (((product?.price - discountPercentage * product?.price) *
                product?.tax) /
                100) *
              product?.quantity,
            AccountCode:
              sellingOrder?.status === 'shipped'
                ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
            UnitAmount: product?.price,
            Tracking: [
              {
                TrackingCategoryID:
                  accountingServices[0]?.tenant?.accServiceTrack[0]
                    ?.accountingServiceId,
                TrackingOptionID: accountingServices[0]?.serviceJson?.class,
              },
            ],
          }));

          const serviceLineItems = services?.map((service) => ({
            ItemCode: service?.serviceId,
            Description: service?.name,
            TaxAmount:
              ((service?.price - discountPercentage * service?.price) *
                service?.tax) /
              100,
            AccountCode:
              sellingOrder?.status === 'shipped'
                ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
            UnitAmount: service?.price,
            Tracking: [
              {
                TrackingCategoryID:
                  accountingServices[0]?.tenant?.accServiceTrack[0]
                    ?.accountingServiceId,
                TrackingOptionID: accountingServices[0]?.serviceJson?.class,
              },
            ],
          }));

          const compositLineItems = compositeProducts?.map(
            (compositeProduct) => ({
              ItemCode: compositeProduct?.code,
              Description: compositeProduct?.name,
              TaxAmount:
                (((compositeProduct?.price -
                  discountPercentage * compositeProduct?.price) *
                  compositeProduct?.tax) /
                  100) *
                compositeProduct?.quantity,
              AccountCode:
                sellingOrder?.status === 'shipped'
                  ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                  : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
              UnitAmount: compositeProduct?.price,
              Tracking: [
                {
                  TrackingCategoryID:
                    accountingServices[0]?.tenant?.accServiceTrack[0]
                      ?.accountingServiceId,
                  TrackingOptionID: accountingServices[0]?.serviceJson?.class,
                },
              ],
            }),
          );

          const classLineItems = classes?.map((classService) => ({
            ItemCode: classService?.classId,
            Description: classService?.name,
            TaxAmount:
              ((classService?.price -
                discountPercentage * classService?.price) *
                classService?.tax) /
              100,
            AccountCode:
              sellingOrder?.status === 'shipped'
                ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
            UnitAmount: classService?.price,
            Tracking: [
              {
                TrackingCategoryID:
                  accountingServices[0]?.tenant?.accServiceTrack[0]
                    ?.accountingServiceId,
                TrackingOptionID: accountingServices[0]?.serviceJson?.class,
              },
            ],
          }));
          const membershipLineItems = memberships?.map((membership) => ({
            ItemCode: membership?.membershipId,
            Description: membership?.name,
            TaxAmount:
              ((membership?.price - discountPercentage * membership?.price) *
                membership?.tax) /
              100,
            AccountCode:
              sellingOrder?.status === 'shipped'
                ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
            UnitAmount: membership?.price,
            Tracking: [
              {
                TrackingCategoryID:
                  accountingServices[0]?.tenant?.accServiceTrack[0]
                    ?.accountingServiceId,
                TrackingOptionID: accountingServices[0]?.serviceJson?.class,
              },
            ],
          }));

          const updateInvoiceData = {
            Invoices: [
              {
                InvoiceID: xeroInvoice?.accountingServiceId,
                LineItems: [
                  ...productLineItems,
                  ...serviceLineItems,
                  ...compositLineItems,
                  ...classLineItems,
                  ...membershipLineItems,
                  {
                    ItemCode:
                      accountingServices[0]?.serviceJson?.defaultDiscount?.toString(),
                    Description: 'Discount',
                    TaxAmount: 0,
                    AccountCode:
                      sellingOrder?.status === 'shipped'
                        ? accountingServices[0]?.serviceJson?.['defaultRevenue']
                        : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
                    UnitAmount: `${-sellingOrder?.discount}`,
                    Tracking: [
                      {
                        TrackingCategoryID:
                          accountingServices[0]?.tenant?.accServiceTrack[0]
                            ?.accountingServiceId,
                        TrackingOptionID:
                          accountingServices[0]?.serviceJson?.class,
                      },
                    ],
                  },
                ],
              },
            ],
          };

          const response = await xeroApi.post(`/Invoices`, updateInvoiceData, {
            headers,
          });

          const LineItems = response?.data?.Invoices[0]?.LineItems?.map(
            (item) => {
              return item?.LineItemID;
            },
          );

          if (response?.data?.Invoices[0]?.InvoiceID) {
            await strapi.entityService.update(
              'api::acc-service-order.acc-service-order',
              xeroInvoice.id,
              {
                data: {
                  invoiceLineItems: LineItems,
                },
              },
            );
          }

          if (sellingOrder?.dealTransactions?.length > 0) {
            for (
              let index = 0;
              index < sellingOrder?.dealTransactions?.length;
              index++
            ) {
              let paymentData;
              const dealTransaction = sellingOrder?.dealTransactions[index];
              const paymentMethodMapping =
                dealTransaction?.paymentMethod?.accProductMappings?.find(
                  (mapping) => mapping?.accountingServiceType === 'xero',
                );
              if (dealTransaction?.status === 'Paid' && paymentMethodMapping) {
                const sumOfTransactions = sellingOrder?.dealTransactions
                  ?.filter((transaction) => transaction?.status === 'Paid')
                  ?.reduce((acc, transaction) => {
                    return acc + (transaction?.summary || 0);
                  }, 0);
                const dueAmmount = sellingOrder?.total - sumOfTransactions;
                paymentData = {
                  Invoice: {
                    InvoiceID: response?.data?.Invoices[0]?.InvoiceID,
                  },
                  Account: {
                    Code:
                      paymentMethodMapping?.serviceAccountId ||
                      accountingServices[0]?.serviceJson?.depositToAccount,
                  },
                  Date: new Date().toISOString(),
                  Amount:
                    dealTransaction?.paid > dueAmmount && dueAmmount > 0
                      ? dueAmmount
                      : dealTransaction?.paid,
                };
                await xeroApi.post(`/Payments`, paymentData, { headers });
              }
            }
          }
        } catch (error) {
          handleError(
            'editInvoiceWithXero',
            'Failed to eidt invoice with Xero',
            error,
          );
        }
      }
    },
  }),
);
