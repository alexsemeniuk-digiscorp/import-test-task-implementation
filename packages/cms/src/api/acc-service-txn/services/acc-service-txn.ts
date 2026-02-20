/**
 * acc-service-txn service
 */

import { factories } from '@strapi/strapi';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleError } from '../../../graphql/helpers/errors';
import { NexusGenInputs } from '../../../types/generated/graphql';
import { DEFAULT_SERVICE } from '../../helpers/constants';
import quickBookApi from '../../helpers/quickBooksApi';
import xeroApi from '../../helpers/xeroApi';
import { ServiceJsonType } from '../../lifecyclesHelpers/types';

export default factories.createCoreService(
  'api::acc-service-txn.acc-service-txn',
  ({ strapi }) => ({
    async syncDealTransactionWithXero(dealTransactionId: ID) {
      const dealTransaction = await strapi.db
        .query('api::deal-transaction.deal-transaction')
        .findOne({
          where: { id: dealTransactionId },
          populate: [
            'sellingOrder.products.product.product',
            'contact.accServiceContacts.businessLocation',
            'company.accServiceContacts.businessLocation',
            'businessLocation',
            'sellingOrder.products.tax',
            'paymentMethod.accProductMappings.accServiceConn',
            'sellingOrder.products.taxCollection',
            'sellingOrder.services.tax',
            'sellingOrder.services.service',
            'sellingOrder.services.service.serviceLocationInfo',
            'sellingOrder.services.service.serviceLocationInfo.service',
            'sellingOrder.services.taxCollection.taxes',
            'sellingOrder.compositeProducts.tax',
            'sellingOrder.compositeProducts.taxCollection.taxes',
            'sellingOrder.classes.tax',
            'sellingOrder.classes.class.classLocationInfo.class',
            'sellingOrder.classes.taxCollection.taxes',
            'sellingOrder.memberships.membership',
            'sellingOrder.memberships.tax',
            'sellingOrder.memberships.taxCollection.taxes',
            'chartAccount.accProductMappings.accServiceConn',
            'chartCategory.accProductMappings.accServiceConn',
            'chartSubcategory.accProductMappings.accServiceConn',
          ],
        });
      if (dealTransaction?.status !== 'Paid') {
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
                $eq: Number(dealTransaction?.businessLocation?.id),
              },
            },
          },
          populate: ['businessLocation', 'tenant.accServiceTrack'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      const products = [];
      const services = [];
      const compositeProducts = [];
      const classes = [];
      const memberships = [];
      for (
        let index = 0;
        index < dealTransaction?.sellingOrder?.products?.length;
        index++
      ) {
        const taxRate = dealTransaction?.sellingOrder?.products[index]?.tax
          ?.rate
          ? dealTransaction?.sellingOrder?.products[index]?.tax?.rate
          : dealTransaction?.sellingOrder?.products?.taxCollection?.taxes?.reduce(
              (totalTax, tax) => totalTax + tax?.rate,
              0,
            );
        products[index] = {
          quantity: dealTransaction?.sellingOrder?.products[index]?.quantity,
          productId:
            dealTransaction?.sellingOrder?.products[index]?.product?.product
              ?.productId,
          price: dealTransaction?.sellingOrder?.products[index]?.price,
          tax: taxRate,
          name: dealTransaction?.sellingOrder?.products[index]?.product?.product
            ?.name,
        };
      }

      for (
        let index = 0;
        index < dealTransaction?.sellingOrder?.services?.length;
        index++
      ) {
        const taxRate = dealTransaction?.sellingOrder?.services[index]?.tax
          ?.rate
          ? dealTransaction?.sellingOrder?.services[index]?.tax?.rate
          : dealTransaction?.sellingOrder?.services?.taxCollection?.taxes?.reduce(
              (totalTax, tax) => totalTax + tax?.rate,
              0,
            );
        services[index] = {
          serviceId:
            dealTransaction?.sellingOrder?.services[index]?.service
              ?.serviceLocationInfo?.service?.serviceId,
          price: dealTransaction?.sellingOrder?.services[index]?.price,
          tax: taxRate,
          name: dealTransaction?.sellingOrder?.services[index]?.service
            ?.serviceLocationInfo?.service?.name,
        };
      }

      for (
        let index = 0;
        index < dealTransaction?.sellingOrder?.compositeProducts?.length;
        index++
      ) {
        const taxRate = dealTransaction?.sellingOrder?.compositeProducts[index]
          ?.tax?.rate
          ? dealTransaction?.sellingOrder?.compositeProducts[index]?.tax?.rate
          : dealTransaction?.sellingOrder?.compositeProducts?.taxCollection?.taxes?.reduce(
              (totalTax, tax) => totalTax + tax?.rate,
              0,
            );
        const compositeProduct = await strapi.service(
          'api::acc-service-entity.acc-service-entity',
        );
        const xeroCompositeProduct =
          await compositeProduct.findOrCreateCompositeProductXero(
            accountingServices[0]?.id,
          );
        compositeProducts[index] = {
          code: xeroCompositeProduct?.Code,
          price: dealTransaction?.sellingOrder?.compositeProducts[index]?.price,
          tax: taxRate,
          name: DEFAULT_SERVICE,
          quantity:
            dealTransaction?.sellingOrder?.compositeProducts[index]?.quantity,
        };
      }

      for (
        let index = 0;
        index < dealTransaction?.sellingOrder?.classes?.length;
        index++
      ) {
        const taxRate = dealTransaction?.sellingOrder?.classes[index]?.tax?.rate
          ? dealTransaction?.sellingOrder?.classes[index]?.tax?.rate
          : dealTransaction?.sellingOrder?.classes?.taxCollection?.taxes?.reduce(
              (totalTax, tax) => totalTax + tax?.rate,
              0,
            );
        classes[index] = {
          classId:
            dealTransaction?.sellingOrder?.classes[index]?.class
              ?.classLocationInfo?.class?.classId,
          price: dealTransaction?.sellingOrder?.classes[index]?.price,
          tax: taxRate,
          name: dealTransaction?.sellingOrder?.classes[index]?.class
            ?.classLocationInfo?.class?.name,
        };
      }

      for (
        let index = 0;
        index < dealTransaction?.sellingOrder?.memberships?.length;
        index++
      ) {
        const taxRate = dealTransaction?.sellingOrder?.memberships[index]?.tax
          ?.rate
          ? dealTransaction?.sellingOrder?.memberships[index]?.tax?.rate
          : dealTransaction?.sellingOrder?.memberships?.taxCollection?.taxes?.reduce(
              (totalTax, tax) => totalTax + tax?.rate,
              0,
            );
        memberships[index] = {
          membershipId:
            dealTransaction?.sellingOrder?.memberships[index]?.membership
              ?.membershipId,
          price: dealTransaction?.sellingOrder?.memberships[index]?.price,
          tax: taxRate,
          name: dealTransaction?.sellingOrder?.memberships[index]?.membership
            ?.name,
        };
      }

      const xeroInvoice = await strapi.db
        .query('api::acc-service-order.acc-service-order')
        .findOne({
          where: {
            sellingOrder: dealTransaction?.sellingOrder?.id,
            serviceType: 'xero',
            isSynced: true,
            businessLocation: dealTransaction?.businessLocation?.id,
          },
        });

      const paymentMethodMapping =
        dealTransaction?.paymentMethod?.accProductMappings?.find(
          (mapping) =>
            mapping?.accountingServiceType === 'xero' &&
            mapping?.accServiceConn?.id === accountingServices[0]?.id,
        );

      const headers = {
        'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.accessToken}`,
        'accountingServiceId': accountingServices[0]?.id,
        'Xero-Tenant-Id': accountingServices[0]?.serviceJson?.xeroTenantId,
      };

      let xeroContact;
      if (dealTransaction?.contact?.id) {
        xeroContact = await dealTransaction?.contact?.accServiceContacts.filter(
          (contact) =>
            contact.serviceType === 'xero' &&
            contact?.businessLocation?.id ===
              dealTransaction?.businessLocation?.id,
        );
      } else {
        xeroContact = await dealTransaction?.company?.accServiceContacts.filter(
          (company) =>
            company.serviceType === 'xero' &&
            company?.businessLocation?.id ===
              dealTransaction?.businessLocation?.id,
        );
      }
      let revenueAccount;
      if (dealTransaction?.chartSubcategory?.accProductMappings?.length) {
        const mapping =
          await dealTransaction?.chartSubcategory?.accProductMappings.filter(
            (item) => item?.accServiceConn?.id == accountingServices[0].id,
          );
        revenueAccount = mapping[0]?.serviceAccountId;
      } else if (dealTransaction?.chartCategory?.accProductMappings?.length) {
        const mapping =
          await dealTransaction?.chartCategory?.accProductMappings.filter(
            (item) => item?.accServiceConn?.id == accountingServices[0].id,
          );
        revenueAccount = mapping[0]?.serviceAccountId;
      } else if (dealTransaction?.chartAccount?.accProductMappings?.length) {
        const mapping =
          await dealTransaction?.chartAccount?.accProductMappings.filter(
            (item) => item?.accServiceConn?.id == accountingServices[0].id,
          );
        revenueAccount = mapping[0]?.serviceAccountId;
      }
      const discountPercentage =
        dealTransaction?.sellingOrder?.discount /
        dealTransaction?.sellingOrder?.subTotal;
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
          dealTransaction?.sellingOrder?.status === 'shipped'
            ? revenueAccount ||
              accountingServices[0]?.serviceJson?.['defaultRevenue']
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
          dealTransaction?.sellingOrder?.status === 'shipped'
            ? revenueAccount ||
              accountingServices[0]?.serviceJson?.['defaultRevenue']
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

      const compositLineItems = compositeProducts?.map((compositeProduct) => ({
        ItemCode: compositeProduct?.code,
        Description: compositeProduct?.name,
        TaxAmount:
          (((compositeProduct?.price -
            discountPercentage * compositeProduct?.price) *
            compositeProduct?.tax) /
            100) *
          compositeProduct?.quantity,
        AccountCode:
          dealTransaction?.sellingOrder?.status === 'shipped'
            ? revenueAccount ||
              accountingServices[0]?.serviceJson?.['defaultRevenue']
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
      }));

      const classLineItems = classes?.map((classService) => ({
        ItemCode: classService?.classId,
        Description: classService?.name,
        TaxAmount:
          ((classService?.price - discountPercentage * classService?.price) *
            classService?.tax) /
          100,
        AccountCode:
          dealTransaction?.sellingOrder?.status === 'shipped'
            ? revenueAccount ||
              accountingServices[0]?.serviceJson?.['defaultRevenue']
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
          dealTransaction?.sellingOrder?.status === 'shipped'
            ? revenueAccount ||
              accountingServices[0]?.serviceJson?.['defaultRevenue']
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

      // Invoice doesn't exist in Xero for the order - create invoice & payment
      if (!xeroInvoice) {
        const invoiceData = {
          Invoices: [
            {
              Type: 'ACCREC',
              Contact: {
                ContactId: xeroContact[0]?.accountingServiceId,
              },
              SubTotal: dealTransaction?.sellingOrder?.subTotal,
              TotalTax: dealTransaction?.sellingOrder?.tax,
              Total: dealTransaction?.sellingOrder?.total?.toFixed(2),
              Date: new Date().toISOString(),
              DueDate: new Date().toISOString(),
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
                    dealTransaction?.sellingOrder?.status === 'shipped'
                      ? revenueAccount ||
                        accountingServices[0]?.serviceJson?.['defaultRevenue']
                      : accountingServices[0]?.serviceJson?.prePaymentService?.toString(),
                  UnitAmount: `${-dealTransaction?.sellingOrder?.discount}`,
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
              Status: 'AUTHORISED',
              CurrencyCode: 'USD',
              Reference: `CaratIQ Order - ${dealTransaction?.sellingOrder?.orderId}`,
            },
          ],
        };
        let paymentData = {};
        try {
          const response = await xeroApi.post(`/Invoices`, invoiceData, {
            headers,
          });

          const LineItems = response?.data?.Invoices[0]?.LineItems?.map(
            (item) => {
              return item?.LineItemID;
            },
          );

          if (response?.data?.Invoices[0]?.InvoiceID) {
            await strapi.entityService.create(
              'api::acc-service-order.acc-service-order',
              {
                data: {
                  sellingOrder: dealTransaction?.sellingOrder?.id,
                  accountingServiceId: response?.data?.Invoices[0]?.InvoiceID,
                  businessLocation: accountingServices[0]?.businessLocation?.id,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'xero',
                  invoiceLineItems: LineItems,
                },
              },
            );
          }

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
              dealTransaction?.paid > dealTransaction?.sellingOrder?.total
                ? dealTransaction?.sellingOrder?.total
                : dealTransaction?.paid,
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
                  dealTransaction: dealTransactionId,
                  accountingServiceId:
                    paymentRespone?.data?.Payments[0]?.PaymentID,
                  businessLocation: accountingServices[0]?.businessLocation?.id,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'xero',
                  transactionType: 'sell',
                },
              },
            );
          } catch (error) {
            handleError(
              'syncDealTransactionWithXero',
              'Failed to sync deal transaction with Xero',
              error,
            );
          }
        } catch (error) {
          handleError(
            'syncDealTransactionWithXero',
            'Failed to sync deal transaction with Xero -2',
            error,
          );
        }
      }
      // Invoice already exist in Xero for the order - create payment to invoice
      else {
        const paymentData = {
          Invoice: {
            InvoiceID: xeroInvoice?.accountingServiceId,
          },
          Account: {
            Code:
              paymentMethodMapping?.serviceAccountId ||
              accountingServices[0]?.serviceJson?.depositToAccount,
          },
          Date: new Date().toISOString(),
          Amount: dealTransaction?.paid,
        };

        try {
          const paymentRespone = await xeroApi.post(`/Payments`, paymentData, {
            headers,
          });

          await strapi.entityService.create(
            'api::acc-service-txn.acc-service-txn',
            {
              data: {
                dealTransaction: dealTransactionId,
                accountingServiceId:
                  paymentRespone?.data?.Payments[0]?.PaymentID,
                businessLocation: accountingServices[0]?.businessLocation?.id,
                isSynced: true,
                syncDate: new Date(),
                serviceType: 'xero',
                transactionType: 'sell',
              },
            },
          );
        } catch (error) {
          handleError(
            'syncDealTransactionWithXero',
            'Failed to sync deal transaction with Xero -3',
            error,
          );
        }
      }
    },
    async syncRefundWithXero(dealTransactionId: ID) {
      const dealTransaction = await strapi.db
        .query('api::deal-transaction.deal-transaction')
        .findOne({
          where: { id: dealTransactionId },
          populate: [
            'sellingOrder.products.product.product',
            'contact.accServiceContacts.businessLocation',
            'businessLocation',
            'sellingOrder.products.tax',
            'paymentMethod.accProductMappings.accServiceConn',
          ],
        });

      const accountingServices = await strapi.entityService.findMany(
        'api::acc-service-conn.acc-service-conn',
        {
          filters: {
            serviceType: {
              $eq: 'xero',
            },
            businessLocation: {
              id: {
                $eq: Number(dealTransaction?.businessLocation?.id),
              },
            },
          },
          populate: ['businessLocation', 'tenant.accServiceTrack'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      if (dealTransaction?.status !== 'Refunded') {
        return;
      }
      const contact = await dealTransaction?.contact?.accServiceContacts.filter(
        (contact) =>
          contact.serviceType === 'xero' &&
          contact?.businessLocation?.id ===
            dealTransaction?.businessLocation?.id,
      );

      const refundData = {
        BankTransactions: [
          {
            Type: 'SPEND',
            Contact: {
              ContactID: contact[0]?.accountingServiceId,
            },
            Date: new Date(),
            LineItems: [
              {
                Description: 'Refund on Invoice',
                Quantity: 1,
                UnitAmount: dealTransaction?.paid,
                AccountCode: accountingServices[0]?.serviceJson?.refundAccount,
                Tracking: [
                  {
                    TrackingCategoryID:
                      accountingServices[0]?.tenant?.accServiceTrack[0]
                        ?.accountingServiceId,
                    TrackingOptionID: accountingServices[0]?.serviceJson?.class,
                  },
                ],
              },
            ],
            TaxType: 'NONE',
            BankAccount: {
              AccountID: accountingServices[0]?.serviceJson?.refundService,
            },
            Reference: `Refund for CaratIQ Order - ${dealTransaction?.sellingOrder?.orderId}`,
          },
        ],
      };
      const headers = {
        'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.accessToken}`,
        'accountingServiceId': accountingServices[0]?.id,
        'Xero-Tenant-Id': accountingServices[0]?.serviceJson?.xeroTenantId,
      };

      try {
        await xeroApi.post(`/BankTransactions`, refundData, { headers });
      } catch (error) {
        handleError(
          'syncRefundWithXero',
          'Failed to sync refund transaction with Xero',
          error,
        );
      }
    },
    async syncDealTransactionWithQuickBooks(
      dealTransactionId: ID,
      invoiceId?: string,
    ) {
      try {
        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const transaction = await strapi.entityService.findOne(
          'api::deal-transaction.deal-transaction',
          dealTransactionId,
          {
            populate: [
              'sellingOrder',
              'sellingOrder.businessLocation',
              'sellingOrder.accServiceOrders',
              'sellingOrder.dealTransactions',
              'contact',
              'company',
              'paymentMethod',
              'paymentMethod.accProductMappings.accServiceConn',
              'tenant',
              'businessLocation',
              'chartAccount.accProductMappings.accServiceConn',
              'chartCategory.accProductMappings.accServiceConn',
              'chartSubcategory.accProductMappings.accServiceConn',
            ],
          },
        );
        const businessLocationId =
          (await transaction?.sellingOrder?.businessLocation?.id) ||
          transaction?.businessLocation?.id;
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

        if (!accountingServices?.length) {
          return;
        }
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'sellOrder',
            tenantId: transaction.tenant.id,
            serviceType: 'quickBooks',
          });
        if (!mappingStatus) {
          return new Error(`Please complete the quick books mapping.`);
        }

        let accountingServiceContact;
        if (transaction.status === 'Paid') {
          if (transaction?.contact?.id) {
            accountingServiceContact = await strapi.entityService.findMany(
              'api::acc-service-contact.acc-service-contact',
              {
                filters: {
                  contact: {
                    id: {
                      $eq: transaction?.contact?.id as ID,
                    },
                  },
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
          } else {
            accountingServiceContact = await strapi.entityService.findMany(
              'api::acc-service-contact.acc-service-contact',
              {
                filters: {
                  company: {
                    id: {
                      $eq: transaction?.company?.id as ID,
                    },
                  },
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
          }
          if (!accountingServiceContact[0]?.accountingServiceId) {
            return;
          }

          const serviceJson = accountingServices[0]
            ?.serviceJson as ServiceJsonType;
          let quickBookDealTransaction;
          if (!serviceJson?.realmId) {
            return;
          }
          const paymentMethod =
            await transaction.paymentMethod.accProductMappings.filter(
              (item) =>
                item.accountingServiceType === 'quickBooks' &&
                item?.accServiceConn?.id === accountingServices[0]?.id,
            );
          const data = {
            TotalAmt: transaction.paid.toFixed(2),
            CustomerRef: {
              value: accountingServiceContact[0]?.accountingServiceId,
            },
            PaymentRefNum: transaction?.sellingOrder?.orderId ?? '',
            PaymentMethodRef: {
              value:
                paymentMethod[0]?.serviceAccountId ||
                serviceJson?.defaultPaymentMethod,
            },
            ClassRef: {
              value: serviceJson?.class,
            },
            Line: [
              {
                DetailType: 'SalesItemLineDetail',
                Amount: transaction?.paid,
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson?.prePaymentService,
                  },
                  Qty: 1,
                },
              },
            ],
            DepositToAccountRef: {
              value:
                paymentMethod[0]?.depositToAccount ||
                serviceJson?.depositToAccount,
            },
            DocNumber: transaction?.dealTransactionId,
            DepartmentRef: {
              value: serviceJson?.department,
            },
          };

          const accountingServiceDealTransaction = await strapi.db
            .query('api::acc-service-txn.acc-service-txn')
            .findOne({
              where: {
                dealTransaction: dealTransactionId,
                serviceType: 'quickBooks',
                businessLocation: businessLocationId,
              },
            });
          if (accountingServiceDealTransaction?.id) {
            data['Id'] = accountingServiceDealTransaction?.accountingServiceId;
            data['SyncToken'] = accountingServiceDealTransaction?.syncToken;
          }

          if (invoiceId) {
            data.Line = [
              {
                DetailType: 'SalesItemLineDetail',
                Amount: transaction.paid,
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson?.prePaymentService,
                  },
                  Qty: 1,
                },
              },
            ];
          }
          try {
            const headers = {
              Authorization: `Bearer ${serviceJson.accessToken}`,
              accountingServiceId: accountingServices[0].id,
            };
            const response = await quickBookApi.post(
              `/${serviceJson.realmId}/salesreceipt`,
              data,
              { headers },
            );
            if (!response?.data?.SalesReceipt) {
              return;
            }
            quickBookDealTransaction = response.data.SalesReceipt;
          } catch (error) {
            handleError(
              'syncDealTransactionWithQuickBooks',
              'Failed to create Sales Reciept with Quick Books',
              error,
            );
          }

          if (!quickBookDealTransaction) {
            return;
          }

          if (accountingServiceDealTransaction?.id) {
            await strapi.entityService.update(
              'api::acc-service-txn.acc-service-txn',
              accountingServiceDealTransaction?.id,
              {
                data: {
                  syncDate: new Date(),
                  syncToken: quickBookDealTransaction.SyncToken,
                },
              },
            );
          } else {
            await strapi.entityService.create(
              'api::acc-service-txn.acc-service-txn',
              {
                data: {
                  dealTransaction: dealTransactionId,
                  accountingServiceId: quickBookDealTransaction.Id,
                  businessLocation: businessLocationId,
                  syncToken: quickBookDealTransaction.SyncToken,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'quickBooks',
                  transactionType: 'sell',
                },
              },
            );
          }
        }
      } catch (error) {
        handleError(
          'syncDealTransactionWithQuickBooks',
          'Failed to create Sales Reciept with Quick Books -2',
          error,
        );
      }
    },
    async syncExpenseDealTransactionWithQuickBooks(dealTransactionId: ID) {
      try {
        const accountingMappingService = await strapi.service(
          'api::acc-product-mapping.acc-product-mapping',
        );
        const transaction = await strapi.entityService.findOne(
          'api::deal-transaction.deal-transaction',
          dealTransactionId,
          {
            populate: [
              'contact',
              'company',
              'sellingOrder',
              'company.accServiceVendors.businessLocation',
              'sellingOrder.businessLocation.accServiceConn',
              'sellingOrder.accServiceBill',
              'sellingOrder.contact.accServiceVendors.businessLocation',
              'sellingOrder.company.accServiceVendors.businessLocation',
              'sellingOrder.accServiceBills',
              'contact.accServiceVendors',
              'contact.accServiceVendors.businessLocation',
              'chartAccount.accProductMappings.accServiceConn',
              'chartCategory.accProductMappings.accServiceConn',
              'chartSubcategory.accProductMappings.accServiceConn',
              'paymentMethod',
              'paymentMethod.accProductMappings.accServiceConn',
              'tenant',
              'businessLocation',
            ],
          },
        );
        const businessLocationId =
          (await transaction?.sellingOrder?.businessLocation?.id) ||
          transaction?.businessLocation?.id;
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
        if (!accountingServices?.length) {
          return;
        }
        const mappingStatus =
          await accountingMappingService.defaultMappingStatus({
            entityType: 'purchaseOrder',
            tenantId: transaction.tenant.id,
            serviceType: 'quickBooks',
          });

        if (!mappingStatus || !serviceJson?.realmId) {
          return new Error(`Please complete the quick books mapping.`);
        }

        if (transaction.status === 'Paid') {
          let expnseAccount;
          if (transaction?.chartSubcategory?.accProductMappings?.length) {
            const mapping =
              await transaction?.chartSubcategory?.accProductMappings.filter(
                (item) => item?.accServiceConn?.id == accountingServices[0].id,
              );
            expnseAccount = mapping[0]?.serviceAccountId;
          } else if (transaction?.chartCategory?.accProductMappings?.length) {
            const mapping =
              await transaction?.chartCategory?.accProductMappings.filter(
                (item) => item?.accServiceConn?.id == accountingServices[0].id,
              );
            expnseAccount = mapping[0]?.serviceAccountId;
          } else if (transaction?.chartAccount?.accProductMappings?.length) {
            const mapping =
              await transaction?.chartAccount?.accProductMappings.filter(
                (item) => item?.accServiceConn?.id == accountingServices[0].id,
              );
            expnseAccount = mapping[0]?.serviceAccountId;
          }

          let accountingServiceVendor: NexusGenInputs['AccServiceVendorFiltersInput'];
          if (transaction?.contact) {
            accountingServiceVendor =
              await transaction?.contact?.accServiceVendors.filter((item) => {
                if (
                  item.serviceType === 'quickBooks' &&
                  item?.businessLocation?.id === businessLocationId
                ) {
                  return item;
                }
              })[0];
          } else if (transaction?.company) {
            accountingServiceVendor =
              await transaction?.company?.accServiceVendors.filter((item) => {
                if (
                  item.serviceType === 'quickBooks' &&
                  item?.businessLocation?.id === businessLocationId
                ) {
                  return item;
                }
              })[0];
          }
          const paymentMethodDetail = await strapi.db
            .query('api::acc-product-mapping.acc-product-mapping')
            .findOne({
              where: {
                accountingServiceType: 'quickBooks',
                accServiceConn: accountingServices[0].id,
                type: 'paymentMethods',
                paymentMethod: transaction.paymentMethod.id,
              },
            });

          const paymentType = await strapi.db
            .query('api::acc-product-mapping.acc-product-mapping')
            .findOne({
              where: {
                paymentType: paymentMethodDetail?.serviceAccountId,
                accServiceConn: accountingServices[0].id,
              },
            });
          let quickBookDealTransaction;
          const data = {
            PaymentType:
              paymentMethodDetail?.serviceAccountId ||
              serviceJson?.defaultPurchasePaymentMethod,
            AccountRef: {
              value:
                paymentType?.serviceAccountId ||
                serviceJson?.defaultPaymentType,
            },
            EntityRef: {
              value: accountingServiceVendor?.accountingServiceId,
              type: 'Vendor',
            },
            Line: [
              {
                Amount: transaction?.paid,
                DetailType: 'AccountBasedExpenseLineDetail',
                AccountBasedExpenseLineDetail: {
                  AccountRef: {
                    value:
                      expnseAccount || serviceJson?.prePaymentAccountPurchase,
                  },
                  ClassRef: {
                    value: serviceJson?.class,
                  },
                },
              },
            ],
            DocNumber: transaction?.sellingOrder?.orderId || '',
            DepartmentRef: {
              value: serviceJson?.department,
            },
          };
          const accountingServiceDealTransaction = await strapi.db
            .query('api::acc-service-txn.acc-service-txn')
            .findOne({
              where: {
                dealTransaction: dealTransactionId,
                serviceType: 'quickBooks',
                businessLocation: businessLocationId,
              },
            });
          if (accountingServiceDealTransaction?.id) {
            data['Id'] = accountingServiceDealTransaction?.accountingServiceId;
            data['SyncToken'] = accountingServiceDealTransaction?.syncToken;
          }

          try {
            const headers = {
              Authorization: `Bearer ${serviceJson.accessToken}`,
              accountingServiceId: accountingServices[0].id,
            };

            const response = await quickBookApi.post(
              `/${serviceJson.realmId}/purchase`,
              data,
              { headers },
            );
            if (!response?.data?.Purchase) {
              return;
            }
            quickBookDealTransaction = response.data.Purchase;
          } catch (error) {
            handleError(
              'syncExpenseDealTransactionWithQuickBooks',
              'Failed to create Expense Transaction with Quick Books',
              error,
            );
          }
          if (!quickBookDealTransaction) {
            return;
          }
          if (accountingServiceDealTransaction?.id) {
            await strapi.entityService.update(
              'api::acc-service-txn.acc-service-txn',
              accountingServiceDealTransaction?.id,
              {
                data: {
                  syncDate: new Date(),
                  syncToken: quickBookDealTransaction?.SyncToken,
                },
              },
            );
          } else {
            const data = {
              dealTransaction: dealTransactionId,
              accountingServiceId: quickBookDealTransaction?.Id,
              businessLocation: businessLocationId,
              syncToken: quickBookDealTransaction?.SyncToken,
              isSynced: true,
              syncDate: new Date(),
              serviceType: 'quickBooks',
              transactionType: 'billPayment',
              accServiceBill:
                transaction?.sellingOrder?.accServiceBill?.id || null,
            };
            if (!data.accServiceBill) {
              delete data.accServiceBill;
            }
            await strapi.entityService.create(
              'api::acc-service-txn.acc-service-txn',
              {
                data: {
                  ...data,
                },
              },
            );
          }
        } else {
          return;
        }
      } catch (error) {
        handleError(
          'syncExpenseDealTransactionWithQuickBooks',
          'Failed to create Expense Transaction with Quick Books -2',
          error,
        );
      }
    },
    async syncRefundTransactionWithQuickBooks(dealTransactionId: ID) {
      try {
        const transaction = await strapi.entityService.findOne(
          'api::deal-transaction.deal-transaction',
          dealTransactionId,
          {
            populate: [
              'sellingOrder',
              'sellingOrder.businessLocation',
              'sellingOrder.accServiceOrders',
              'contact',
              'chartAccount',
              'company',
              'paymentMethod',
              'paymentMethod.accProductMappings',
              'paymentMethod.accProductMappings.accServiceConn',
              'businessLocation',
            ],
          },
        );
        const businessLocationId =
          (await transaction?.sellingOrder?.businessLocation?.id) ||
          transaction?.businessLocation?.id;
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

        if (!accountingServices?.length) {
          return;
        }
        let accountingServiceContact;
        if (transaction.status === 'Refunded') {
          if (transaction?.contact?.id) {
            accountingServiceContact = await strapi.entityService.findMany(
              'api::acc-service-contact.acc-service-contact',
              {
                filters: {
                  contact: {
                    id: {
                      $eq: transaction?.contact?.id as ID,
                    },
                  },
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
          } else {
            accountingServiceContact = await strapi.entityService.findMany(
              'api::acc-service-contact.acc-service-contact',
              {
                filters: {
                  company: {
                    id: {
                      $eq: transaction?.company?.id as ID,
                    },
                  },
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
          }
          const serviceJson = accountingServices[0]
            ?.serviceJson as ServiceJsonType;
          if (!serviceJson?.realmId) {
            return;
          }
          let quickBookDealTransaction;
          const paymentMethod =
            await transaction.paymentMethod.accProductMappings.filter(
              (item) =>
                item.accountingServiceType === 'quickBooks' &&
                item?.accServiceConn?.id === accountingServices[0]?.id,
            )[0];
          const data = {
            CustomerRef: {
              value: accountingServiceContact[0]?.accountingServiceId,
            },
            PaymentMethodRef: {
              value:
                paymentMethod?.serviceAccountId ||
                serviceJson?.defaultPaymentMethod,
            },
            TotalAmt: transaction.paid.toFixed(2),
            DepositToAccountRef: {
              value: serviceJson?.refundAccount,
            },
            PrivateNote: transaction.note,
            CustomerMemo: {
              value: transaction.note,
            },
            Line: [
              {
                Amount: transaction.paid,
                DetailType: 'SalesItemLineDetail',
                SalesItemLineDetail: {
                  ItemRef: {
                    value: serviceJson.refundService,
                  },
                  Qty: '1',
                },
              },
            ],
            ClassRef: {
              value: serviceJson?.class,
            },
            DocNumber: transaction?.sellingOrder?.orderId ?? '',
            DepartmentRef: {
              value: serviceJson?.department,
            },
          };
          const accountingServiceDealTransaction = await strapi.db
            .query('api::acc-service-txn.acc-service-txn')
            .findOne({
              where: {
                dealTransaction: dealTransactionId,
                serviceType: 'quickBooks',
                businessLocation: businessLocationId,
              },
            });
          if (accountingServiceDealTransaction?.id) {
            data['Id'] = accountingServiceDealTransaction?.accountingServiceId;
            data['SyncToken'] = accountingServiceDealTransaction?.syncToken;
          }

          try {
            const headers = {
              Authorization: `Bearer ${serviceJson.accessToken}`,
              accountingServiceId: accountingServices[0].id,
            };

            const response = await quickBookApi.post(
              `/${serviceJson.realmId}/refundreceipt`,
              data,
              { headers },
            );
            if (!response?.data?.RefundReceipt) {
              return;
            }
            quickBookDealTransaction = response.data.RefundReceipt;
          } catch (error) {
            handleError(
              'syncRefundTransactionWithQuickBooks',
              'Failed to Sync Refund Transaction with Quick Books',
              error,
            );
          }
          if (!quickBookDealTransaction) {
            return;
          }

          if (accountingServiceDealTransaction?.id) {
            await strapi.entityService.update(
              'api::acc-service-txn.acc-service-txn',
              accountingServiceDealTransaction?.id,
              {
                data: {
                  syncDate: new Date(),
                  syncToken: quickBookDealTransaction.SyncToken,
                },
              },
            );
          } else {
            await strapi.entityService.create(
              'api::acc-service-txn.acc-service-txn',
              {
                data: {
                  dealTransaction: dealTransactionId,
                  accountingServiceId: quickBookDealTransaction.Id,
                  businessLocation: businessLocationId,
                  syncToken: quickBookDealTransaction.SyncToken,
                  isSynced: true,
                  syncDate: new Date(),
                  serviceType: 'quickBooks',
                  transactionType: 'sell',
                },
              },
            );
          }
        }
      } catch (error) {
        handleError(
          'syncRefundTransactionWithQuickBooks',
          'Failed to Sync Refund Transaction with Quick Books -2',
          error,
        );
      }
    },
  }),
);
