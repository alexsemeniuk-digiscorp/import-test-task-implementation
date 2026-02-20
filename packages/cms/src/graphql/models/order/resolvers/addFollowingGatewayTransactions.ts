import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import {
  NexusGenEnums,
  NexusGenInputs,
} from '../../../../types/generated/graphql';

import { generateId } from '../../../../utils/randomBytes';
import { centsToDollars } from '../helpers/helper';
import { TIME_PERIOD_MAP } from './../../../constants/time';

export const addFollowingGatewayTransactions: GraphQLFieldResolver<
  null,
  null,
  { input: NexusGenInputs['OrderFollowingTransactionsInput'] }
> = async (root, { input }) => {
  try {
    if (
      !input?.recurringAmount &&
      !input?.recurringPeriodCount &&
      !input?.singlePayment &&
      !input?.orderId
    ) {
      return;
    }

    const today = new Date();

    const calculateDueDate = (
      recurringPeriodCount: number,
      recurringPeriod: NexusGenEnums['EnumRecurringPeriodType'],
    ): Date => {
      let dueDate: Date;
      switch (recurringPeriod) {
        case 'daily':
          dueDate = new Date(
            today.getTime() + recurringPeriodCount * TIME_PERIOD_MAP.day,
          );
          break;
        case 'weekly':
          dueDate = new Date(
            today.getTime() + recurringPeriodCount * TIME_PERIOD_MAP.week,
          );
          break;
        case 'monthly':
          dueDate = new Date(
            today.getTime() + recurringPeriodCount * TIME_PERIOD_MAP.month,
          );
          break;
        case 'yearly':
          dueDate = new Date(
            today.getTime() + recurringPeriodCount * TIME_PERIOD_MAP.year,
          );
          break;
        default:
          throw new Error('Invalid recurring period');
      }
      return dueDate;
    };

    const currentOrder = await strapi.entityService.findOne(
      'api::order.order',
      input?.orderId as ID,
      {
        populate: [
          'contact',
          'company',
          'tenant',
          'businessLocation',
          'dealTransactions',
        ],
      },
    );

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

    let paymentMethodId: ID;
    const existingPaymentMethod = await strapi.entityService.findMany(
      'api::payment-method.payment-method',
      {
        filters: {
          name: 'cash',
          tenant: {
            id: {
              $eq: currentOrder.tenant.id,
            },
          },
        },
        fields: ['id'],
      },
    );

    if (existingPaymentMethod.length) {
      paymentMethodId = existingPaymentMethod[0].id;
    } else {
      const newPaymentMethod = await strapi.entityService.create(
        'api::payment-method.payment-method',
        {
          data: {
            name: 'cash',
            tenant: currentOrder.tenant.id,
            paymentType: 'sell',
          },
        },
      );
      paymentMethodId = newPaymentMethod?.id;
    }

    const openTransactions = currentOrder?.dealTransactions?.filter(
      (transaction) => transaction?.status === 'Open',
    );

    // Partial Payment transaction
    if (
      input?.singlePayment &&
      !input?.recurringAmount &&
      !input?.recurringPeriodCount
    ) {
      const openTransaction = currentOrder?.dealTransactions?.find(
        (transaction) => transaction?.status === 'Open',
      );
      const sumOfTransactions = currentOrder?.dealTransactions
        ?.filter((transaction) => transaction.status === 'Paid')
        ?.reduce((acc, transaction) => {
          return acc + (transaction.summary || 0);
        }, 0);
      if (
        !openTransaction &&
        currentOrder?.total > sumOfTransactions &&
        currentOrder?.total - input?.singlePayment > 0
      ) {
        await strapi.entityService.create(
          'api::deal-transaction.deal-transaction',
          {
            data: {
              summary: currentOrder?.total - input?.singlePayment,
              paid: 0,
              dueDate: currentOrder.dueDate ?? new Date(),
              company: currentOrder?.company?.id ?? null,
              contact: currentOrder?.contact?.id ?? null,
              sellingOrder: currentOrder.id,
              status: 'Open',
              chartAccount:
                currentOrder.type === 'purchase'
                  ? costOfGoodsSoldAccount?.[0]?.id
                  : revenueAccount?.[0]?.id,
              repetitive: 'once',
              paymentMethod: paymentMethodId,
              dealTransactionId: generateId(),
              tenant: currentOrder?.tenant?.id,
              businessLocation: currentOrder?.businessLocation?.id,
            },
          },
        );
      } else if (openTransactions && openTransactions?.length > 0) {
        if (currentOrder?.total > sumOfTransactions) {
          if (openTransactions?.length === 1) {
            await strapi.entityService.update(
              'api::deal-transaction.deal-transaction',
              openTransactions?.[0]?.id,
              {
                data: {
                  summary: currentOrder?.total - sumOfTransactions,
                },
              },
            );
          } else {
            openTransactions.sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
            );

            let remainingAmount = input?.singlePayment;

            for (let i = 0; i < openTransactions.length; i++) {
              if (remainingAmount <= 0) break;

              const transaction = openTransactions[i];

              if (remainingAmount < transaction.summary) {
                await strapi.entityService.update(
                  'api::deal-transaction.deal-transaction',
                  transaction.id,
                  {
                    data: { summary: transaction.summary - remainingAmount },
                  },
                );
                remainingAmount = 0;
                break;
              } else if (remainingAmount === transaction.summary) {
                await strapi.entityService.delete(
                  'api::deal-transaction.deal-transaction',
                  transaction.id,
                );
                remainingAmount = 0;
                break;
              } else {
                await strapi.entityService.delete(
                  'api::deal-transaction.deal-transaction',
                  transaction.id,
                );
                remainingAmount -= transaction.summary;
              }
            }
          }
        } else {
          await Promise.all(
            openTransactions.map(async (openTransaction) => {
              await strapi.entityService.delete(
                'api::deal-transaction.deal-transaction',
                openTransaction.id,
              );
            }),
          );
        }
      }
    }

    // Recurring payment transaction
    if (
      input?.recurringAmount &&
      input?.recurringPeriodCount &&
      input?.recurringPeriod
    ) {
      const promises = [];

      for (let i = 0; i < input?.recurringPeriodCount; i++) {
        const calculatedDueDate = calculateDueDate(
          i + 1,
          input?.recurringPeriod,
        );

        promises.push(
          strapi.entityService.create(
            'api::deal-transaction.deal-transaction',
            {
              data: {
                summary:
                  i === 0
                    ? centsToDollars(
                        input?.recurringAmount + input?.divideRemainder,
                      )
                    : centsToDollars(input?.recurringAmount),
                paid: 0,
                dueDate: calculatedDueDate,
                company: currentOrder?.company?.id ?? null,
                contact: currentOrder?.contact?.id ?? null,
                sellingOrder: currentOrder.id,
                status: 'Open',
                chartAccount: revenueAccount?.[0]?.id,
                repetitive: input?.recurringPeriod,
                dealTransactionId: generateId(),
                paymentMethod: paymentMethodId ?? input?.paymentMethod,
                tenant: currentOrder?.tenant?.id,
                businessLocation: currentOrder?.businessLocation?.id,
              },
            },
          ),
        );
      }

      await Promise.all(promises);

      if (openTransactions && openTransactions?.length > 0) {
        await Promise.all(
          openTransactions.map(async (openTransaction) => {
            await strapi.entityService.delete(
              'api::deal-transaction.deal-transaction',
              openTransaction.id,
            );
          }),
        );
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
