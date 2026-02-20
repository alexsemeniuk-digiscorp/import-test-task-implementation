import axios from 'axios';
import { GraphQLFieldResolver } from 'graphql';
import xeroApi from '../../../../api/helpers/xeroApi';
import { AttachmentSyncInput } from '../order.types';
export const syncAttachmentWithAccountingServices: GraphQLFieldResolver<
  null,
  null,
  { input: AttachmentSyncInput }
> = async (root, { input }) => {
  try {
    const order = await strapi.entityService.findOne(
      'api::order.order',
      input.orderId,
      {
        populate: [
          'businessLocation',
          'dealTransactions',
          'dealTransactions.accServiceTxns',
          'services',
          'services.service',
          'services.service.serviceLocationInfo',
          'services.service.serviceLocationInfo.service',
          'services.taxCollection.taxes',
          'products',
          'products.product',
          'products.tax',
          'products.taxCollection.taxes',
          'products.product.product',
          'contact',
          'accServiceOrders',
          'accServiceBills',
          'files',
        ],
      },
    );
    const quickBooksInvoices = order.accServiceOrders.filter(
      (item) => item.serviceType === 'quickBooks',
    );
    const quickbooksBill = order.accServiceBills.filter(
      (item) => item.serviceType === 'quickBooks',
    );
    const xeroInvoices = order.accServiceOrders.filter(
      (item) => item.serviceType === 'xero',
    );
    if (quickBooksInvoices?.length) {
      const orderService = await strapi.service(
        'api::acc-service-order.acc-service-order',
      );
      await orderService.syncAttachmentsWithQuickBooks(
        input.orderId,
        quickBooksInvoices[0].id,
        'invoice',
      );
    }
    if (quickbooksBill?.length) {
      const orderService = await strapi.service(
        'api::acc-service-order.acc-service-order',
      );
      await orderService.syncAttachmentsWithQuickBooks(
        input.orderId,
        quickbooksBill[0].id,
        'bill',
      );
    }

    if (xeroInvoices?.length) {
      const xeroInvoice = await strapi.db
        .query('api::acc-service-order.acc-service-order')
        .findOne({
          where: {
            sellingOrder: input.orderId,
            serviceType: 'xero',
            isSynced: true,
            businessLocation: order?.businessLocation?.id,
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
                $eq: Number(order?.businessLocation?.id),
              },
            },
          },
          populate: ['businessLocation'],
        },
      );

      if (!accountingServices?.length) {
        return;
      }

      if (order?.files?.length) {
        try {
          const attachmentPromises = order?.files?.map(async (file) => {
            const fileResponse = await axios.get(file.url, {
              responseType: 'arraybuffer',
            });

            const headers = {
              'Authorization': `Bearer ${accountingServices[0]?.serviceJson?.['accessToken']}`,
              'accountingServiceId': accountingServices[0]?.id,
              'Xero-Tenant-Id':
                accountingServices[0]?.serviceJson?.['xeroTenantId'],
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
          throw new Error(error.message);
        }
      }
    }
    return {
      status: true,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
