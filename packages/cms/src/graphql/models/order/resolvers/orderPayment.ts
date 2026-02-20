import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import {
  DEFAULT_APPLICATION_FEE,
  MAXIMUM_AFFIRM_AMOUNT,
  MAXIMUM_AFTERPAY_CLEARPAY_AMOUNT,
  MINIMUM_AFFIRM_AMOUNT,
  MINIMUM_AFTERPAY_CLEARPAY_AMOUNT,
  STRIPE_SECRET_KEY,
} from '../../../constants';
import {
  calculateApplicationFee,
  calculateApplicationFeeForYen,
  dollarsToCents,
} from '../helpers/helper';
import { OrderPaymentInput } from '../order.types';
export const orderPayment: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: OrderPaymentInput }
> = async (root, { input }) => {
  const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
    stripeAccount: input.accountId,
  });
  try {
    const { orderId, paymentMethodId, customer, saveMyCard } = input;
    const order = await strapi.db.query('api::order.order').findOne({
      where: { orderId: orderId },
      populate: ['dealTransactions', 'tenant', 'sales'],
    });

    const userCurrency =
      order?.sales?.preferredCurrency?.split('|')[0]?.toLowerCase() || 'usd';

    let stripeCustomer;
    // Check if a customer with the provided email already exists in Stripe
    if (customer?.email) {
      stripeCustomer = await (
        await stripeInstance.customers.list(
          { email: customer.email },
          { stripeAccount: input.accountId },
        )
      ).data[0];
    }
    const { dealTransactions } = await order;
    const runningTxn = dealTransactions.filter(
      (txn) => txn.status === 'Running',
    )[0];
    const merchantDetail = {
      stripeAccount: input.accountId,
    };

    const tenantStripeSubscription = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: { status: true, tenant: order.tenant.id },
        populate: ['plan', 'tenant'],
      });

    if (saveMyCard && customer?.email) {
      if (stripeCustomer?.id) {
        const existingPaymentMethods = await stripeInstance.paymentMethods.list(
          { customer: stripeCustomer.id, type: 'card' },
          { ...merchantDetail },
        );

        const cardFingerprints = existingPaymentMethods.data.map(
          (method) => method.card.fingerprint,
        );

        const newCardFingerprint = await stripeInstance.paymentMethods
          .retrieve(paymentMethodId)
          .then((method) => method.card.fingerprint);

        const cardExists = cardFingerprints.includes(newCardFingerprint);

        if (cardExists) {
          const methodsToRemove = existingPaymentMethods.data.filter(
            (method) => method.card.fingerprint === newCardFingerprint,
          );

          for (const method of methodsToRemove) {
            await stripeInstance.paymentMethods.detach(method.id, {
              ...merchantDetail,
            });
          }
        }

        await stripeInstance.paymentMethods.attach(
          paymentMethodId,
          {
            customer: stripeCustomer.id,
          },
          { ...merchantDetail },
        );
      } else {
        stripeCustomer = await stripeInstance.customers.create(
          {
            payment_method: paymentMethodId,
            email: customer.email,
            name: customer.name,
          },
          { ...merchantDetail },
        );
      }
    }

    const supportedPaymentMethodTypes = () => {
      const paymentMethodTypes = ['card'];
      if (userCurrency === 'usd') {
        paymentMethodTypes.push('us_bank_account');
        if (
          runningTxn?.summary >= MINIMUM_AFTERPAY_CLEARPAY_AMOUNT &&
          runningTxn?.summary <= MAXIMUM_AFTERPAY_CLEARPAY_AMOUNT
        ) {
          paymentMethodTypes.push('afterpay_clearpay');
        }

        if (
          runningTxn?.summary >= MINIMUM_AFFIRM_AMOUNT &&
          runningTxn?.summary <= MAXIMUM_AFFIRM_AMOUNT
        ) {
          paymentMethodTypes.push('affirm');
        }
      }
      return paymentMethodTypes;
    };

    let paymentIntent;
    const intentPayload = {
      amount:
        userCurrency == 'jpy'
          ? runningTxn.summary
          : dollarsToCents(runningTxn.summary),
      currency: userCurrency,
      payment_method_types: supportedPaymentMethodTypes(),
      application_fee_amount:
        userCurrency == 'jpy'
          ? calculateApplicationFeeForYen(
              runningTxn.summary,
              tenantStripeSubscription?.plan?.applicationFee ??
                DEFAULT_APPLICATION_FEE,
            )
          : calculateApplicationFee(
              runningTxn.summary,
              tenantStripeSubscription?.plan?.applicationFee ??
                DEFAULT_APPLICATION_FEE,
            ),
      metadata: {
        txnId: runningTxn?.id,
      },
    };
    if (!customer?.email) {
      paymentIntent = await stripeInstance.paymentIntents.create(
        {
          ...intentPayload,
        },
        { ...merchantDetail },
      );
    } else {
      paymentIntent = await stripeInstance.paymentIntents.create(
        {
          ...intentPayload,
          payment_method: paymentMethodId,
          customer: stripeCustomer?.id,
        },
        { ...merchantDetail },
      );
    }
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent?.id,
      dealTransactionsId: runningTxn?.dealTransactionId,
      runningTxnId: runningTxn?.id,
      status: true,
      message: 'Payment Success',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
