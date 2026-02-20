import { generateId } from '../../../utils/randomBytes';

export const updateTransactionsOnOrderUpdate = async (
  { params },
  currentOrder,
) => {
  const data = params?.data;
  const skipMeilisearchSync = data?._skipMeilisearchSync;

  if (data?.total || data?.isCustomerWebsite === false) {
    const isSellingOrderModified =
      currentOrder.status !== 'draft' &&
      data?.total !== currentOrder.total &&
      currentOrder?.type !== 'purchase';
    const isPurchaseOrderModified =
      currentOrder?.type === 'purchase' &&
      data?.total !== currentOrder.total &&
      currentOrder?.dealTransactions?.length > 0;

    if (isSellingOrderModified || isPurchaseOrderModified) {
      const revenueAccount = await strapi.entityService.findMany(
        'api::chart-account.chart-account',
        {
          filters: {
            name: {
              $eq: 'Revenue',
            },
          },
          fields: ['id'],
        },
      );

      const costOfGoodsSoldAccount = await strapi.entityService.findMany(
        'api::chart-account.chart-account',
        {
          filters: {
            name: {
              $eq: 'Cost of Goods Sold',
            },
          },
          fields: ['id'],
        },
      );

      const orderService = strapi.service('api::order.order');

      const paidSummary = await orderService.getPaidSummary(params.where.id);

      const unpaidTransaction = currentOrder?.dealTransactions?.find(
        (transaction) => transaction.paid === 0,
      );

      const cashPaymentMethod = await strapi.entityService.findMany(
        'api::payment-method.payment-method',
        {
          filters: {
            name: {
              $eq: 'cash',
            },
            tenant: {
              id: {
                $eq: currentOrder?.tenant?.id,
              },
            },
          },
          fields: ['id'],
        },
      );

      if (paidSummary >= (data?.total ?? currentOrder.total)) {
        if (unpaidTransaction?.id) {
          await strapi.entityService.delete(
            'api::deal-transaction.deal-transaction',
            unpaidTransaction.id,
          );
        }
      } else {
        if (!unpaidTransaction?.id) {
          await strapi.entityService.create(
            'api::deal-transaction.deal-transaction',
            {
              data: {
                summary:
                  Number(data?.total ?? currentOrder.total) -
                  Number(paidSummary),
                paid: 0,
                dueDate: currentOrder?.dueDate ?? new Date(),
                company: currentOrder?.company?.id ?? null,
                contact: currentOrder?.contact?.id ?? null,
                sellingOrder: currentOrder.id,
                customCreationDate: currentOrder.customCreationDate,
                status: 'Open',
                chartAccount:
                  currentOrder.type === 'purchase'
                    ? costOfGoodsSoldAccount?.[0]?.id
                    : revenueAccount?.[0]?.id,
                repetitive: 'once',
                paymentMethod: cashPaymentMethod?.[0]?.id,
                dealTransactionId: generateId(),
                tenant: currentOrder?.tenant?.id,
                businessLocation: currentOrder?.businessLocation?.id,
                ...(skipMeilisearchSync && { _skipMeilisearchSync: true }),
              },
            },
          );
        } else {
          await strapi.entityService.update(
            'api::deal-transaction.deal-transaction',
            unpaidTransaction?.id,
            {
              data: {
                summary:
                  Number(data?.total ?? currentOrder.total) -
                  Number(paidSummary),
                status: 'Open',
                ...(skipMeilisearchSync && { _skipMeilisearchSync: true }),
              },
            },
          );
        }
      }
    }
  }
};
