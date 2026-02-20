import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';

export const addPaymentMethodCustomer: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: { email: string; paymentMethodId: string; accountId: string } }
> = async (root, { input }) => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });
    const stripeCustomer = await (
      await stripeInstance.customers.list({ email: input.email })
    ).data[0];

    // Check if the card already exists for the customer
    const existingPaymentMethods = await stripeInstance.paymentMethods.list({
      customer: stripeCustomer.id,
      type: 'card',
    });
    const cardFingerprints = existingPaymentMethods.data.map(
      (method) => method.card.fingerprint,
    );
    const newCardFingerprint = await stripeInstance.paymentMethods
      .retrieve(input.paymentMethodId)
      .then((method) => method.card.fingerprint);
    const cardExists = cardFingerprints.includes(newCardFingerprint);

    if (cardExists) {
      // Card already exists, do not attach it again
      throw new Error('Card already exists');
    }

    // Attach the new payment method to the customer
    await stripeInstance.paymentMethods.attach(input.paymentMethodId, {
      customer: stripeCustomer.id,
    });

    return {
      status: true,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
