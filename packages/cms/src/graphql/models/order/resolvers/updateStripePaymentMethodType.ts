import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';
import { UpdateStripePaymentMethodTypeInput } from '../order.types';
export const updateStripePaymentMethodType: GraphQLFieldResolver<
  null,
  null,
  { input: UpdateStripePaymentMethodTypeInput }
> = async (root, { input }) => {
  const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
    stripeAccount: input.accountId,
  });

  try {
    const getPaymentMethodId = await stripeInstance.paymentIntents.retrieve(
      input.paymentIntentId,
    );
    const paymentMethodId = getPaymentMethodId.payment_method;

    const getPaymentMethodDetails =
      await stripeInstance.paymentMethods.retrieve(paymentMethodId as string);
    const dealTransactions = await strapi.entityService.findMany(
      'api::deal-transaction.deal-transaction',
      {
        filters: {
          dealTransactionId: input.dealTransactionId,
        },
        fields: ['id'],
        populate: {
          tenant: {
            fields: ['id'],
          },
        },
      },
    );

    let paymentMethodName: string;
    let paymentMethodTypeId: number;

    switch (getPaymentMethodDetails.type) {
      case 'card':
        paymentMethodName =
          getPaymentMethodDetails.card.funding === 'credit'
            ? 'Credit Card'
            : 'Debit Card';
        break;

      case 'affirm':
        paymentMethodName = 'Affirm';
        break;

      case 'afterpay_clearpay':
        paymentMethodName = 'Afterpay';
        break;

      case 'us_bank_account':
        paymentMethodName = 'ACH';
        break;
      //pos terminal
      case 'card_present':
        paymentMethodName =
          getPaymentMethodDetails.card_present.funding === 'credit'
            ? 'Credit Card'
            : 'Debit Card';

        break;
    }

    const existingPaymentMethod = await strapi.db
      .query('api::payment-method.payment-method')
      .findOne({
        where: {
          name: paymentMethodName.toLowerCase(),
          tenant: dealTransactions?.[0]?.tenant.id,
        },
      });

    if (existingPaymentMethod) {
      paymentMethodTypeId = existingPaymentMethod?.id;
    } else {
      const newPaymentMethod = await strapi.entityService.create(
        'api::payment-method.payment-method',
        {
          data: {
            name: paymentMethodName.toLowerCase(),
            tenant: dealTransactions?.[0]?.tenant.id,
            paymentType: 'sell',
          },
        },
      );
      paymentMethodTypeId = newPaymentMethod?.id as number;
    }

    //update deal transaction
    await strapi.entityService.update(
      'api::deal-transaction.deal-transaction',
      dealTransactions?.[0]?.id,
      {
        data: {
          paymentMethod: paymentMethodTypeId,
        },
      },
    );

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};
