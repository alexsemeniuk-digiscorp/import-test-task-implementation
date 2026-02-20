import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../graphql/constants';
import { LifecycleHook } from '../types';

export const addPaymentMethodsOnCancelTxn: LifecycleHook = async ({
  params,
}) => {
  const data = params?.data;
  if (!data) return;

  if (data.status === 'Cancelled') {
    const dealTransaction = await strapi.entityService.findOne(
      'api::deal-transaction.deal-transaction',
      data.id,
      {
        fields: ['id'],
        populate: {
          tenant: {
            fields: ['id'],
            populate: {
              stripe_onboarding: {
                fields: ['id', 'accountId'],
              },
            },
          },
        },
      },
    );

    if (!dealTransaction.tenant) {
      return;
    }
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: dealTransaction.tenant.stripe_onboarding.accountId,
    });

    const paymentIntentData = await stripeInstance.paymentIntents.retrieve(
      data.stripeInfo.paymentIntentId,
    );
    if (!paymentIntentData) {
      return;
    }

    let paymentMethodName: string;
    let paymentMethodId: ID;

    switch (paymentIntentData.last_payment_error.payment_method.type) {
      case 'card':
        paymentMethodName =
          paymentIntentData.last_payment_error.payment_method.card.funding ===
          'credit'
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
          paymentIntentData.last_payment_error.payment_method.card_present
            .funding === 'credit'
            ? 'Credit Card'
            : 'Debit Card';
        break;
    }

    const existingPaymentMethod = await strapi.entityService.findMany(
      'api::payment-method.payment-method',
      {
        filters: {
          name: paymentMethodName.toLowerCase(),
          tenant: {
            id: {
              $eq: dealTransaction.tenant.id,
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
            name: paymentMethodName.toLowerCase(),
            tenant: dealTransaction.tenant.id,
            paymentType: 'sell',
          },
        },
      );
      paymentMethodId = newPaymentMethod?.id;
    }
    await strapi.entityService.update(
      'api::deal-transaction.deal-transaction',
      data.id,
      {
        data: {
          paymentMethod: paymentMethodId,
        },
      },
    );
  }
};
