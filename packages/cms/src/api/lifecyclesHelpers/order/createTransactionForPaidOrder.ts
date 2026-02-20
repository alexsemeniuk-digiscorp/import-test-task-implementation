import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { generateId } from '../../../utils/randomBytes';
import { handleLogger } from './../../../graphql/helpers/errors';

export const createTransactionForPaidOrder = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'lifecycle: createTransactionForPaidOrder',
    `Params:${JSON.stringify(event.params)}`,
  );

  const { data, where } = event.params;
  const entityId = where?.id;

  if (currentOrder.status !== 'received' || data?.paid !== true) return;

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

  const productSetting = await strapi.entityService.findMany(
    'api::product-setting.product-setting',
    {
      filters: {
        tenant: {
          id: {
            $eq: currentOrder?.tenant?.id,
          },
        },
      },
      fields: ['id'],
      populate: {
        defaultPaymentMethod: {
          fields: ['id', 'name'],
        },
      },
    },
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

  if (
    currentOrder?.dealTransactions &&
    currentOrder?.dealTransactions?.length > 0
  ) {
    await Promise.all(
      currentOrder?.dealTransactions?.map(async (dealTransaction) => {
        await strapi.entityService.delete(
          'api::deal-transaction.deal-transaction',
          dealTransaction.id,
        );
      }),
    );
  }

  await strapi.entityService.create('api::deal-transaction.deal-transaction', {
    data: {
      summary: data?.total ?? currentOrder?.subTotal ?? 0,
      paid: data?.total ?? currentOrder?.subTotal ?? 0,
      dueDate: currentOrder.dueDate ?? new Date(),
      company: currentOrder?.company?.id ?? null,
      contact: currentOrder?.contact?.id ?? null,
      sellingOrder: entityId,
      customCreationDate: currentOrder.customCreationDate,
      status: 'Paid',
      chartAccount: costOfGoodsSoldAccount?.[0]?.id,
      repetitive: 'once',
      paymentMethod:
        productSetting?.[0]?.defaultPaymentMethod?.id ??
        cashPaymentMethod?.[0]?.id,
      dealTransactionId: generateId(),
      tenant: currentOrder?.tenant?.id,
      businessLocation: currentOrder?.businessLocation?.id,
    },
  });
};
