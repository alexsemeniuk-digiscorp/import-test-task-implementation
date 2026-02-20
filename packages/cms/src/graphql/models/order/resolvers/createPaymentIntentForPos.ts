import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { DEFAULT_APPLICATION_FEE, STRIPE_SECRET_KEY } from '../../../constants';
import { calculateApplicationFee, dollarsToCents } from '../helpers/helper';
import { CreatePaymentIntentForPosInput } from '../order.types';

export const createPaymentIntentForPos: GraphQLFieldResolver<
  null,
  null,
  { input: CreatePaymentIntentForPosInput }
> = async (root, { input }): Promise<any> => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });
    const { orderId, terminalId } = input;

    const order = await strapi.db.query('api::order.order').findOne({
      where: { id: orderId },
      populate: ['dealTransactions', 'tenant'],
    });
    const { dealTransactions, tenant } = await order;
    const { stripe_onboarding } = await strapi.db
      .query('api::tenant.tenant')
      .findOne({ where: { id: tenant.id }, populate: ['stripe_onboarding'] });
    const runningTxn = dealTransactions.filter(
      (txn) => txn.status === 'Running',
    )[0];

    //check if tenant has active subscription
    const tenantStripeSubscription = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: { status: true, tenant: tenant.id },
        populate: ['plan', 'tenant'],
      });

    const paymentIntent = await stripeInstance.paymentIntents.create(
      {
        amount: dollarsToCents(runningTxn.summary),
        currency: 'usd',
        payment_method_types: ['card_present'],
        capture_method: 'automatic',
        metadata: {
          txnId: runningTxn.id,
        },
        application_fee_amount: calculateApplicationFee(
          runningTxn.summary,
          tenantStripeSubscription?.plan?.applicationFee ??
            DEFAULT_APPLICATION_FEE,
        ),
      },
      {
        stripeAccount: stripe_onboarding.accountId,
      },
    );

    //attach paymentIntent to Pos terminal
    await stripeInstance.terminal.readers.processPaymentIntent(terminalId, {
      payment_intent: paymentIntent.id,
    });

    return {
      paymentIntent: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      dealTransactionId: runningTxn,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
