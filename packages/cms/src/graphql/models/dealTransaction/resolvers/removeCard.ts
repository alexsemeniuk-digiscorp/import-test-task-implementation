import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';

export const removeCard: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: { paymentMethodId: string; accountId: string } }
> = async (root, { input }) => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input?.accountId,
    });
    const paymentMethod = await stripeInstance.paymentMethods.retrieve(
      input.paymentMethodId,
    );
    const cards = await stripeInstance.customers.listPaymentMethods(
      paymentMethod.customer.toString(),
    );

    // Check if the payment method is a card
    if (paymentMethod.type !== 'card') {
      throw new Error('The provided payment method is not a card.');
    }
    const fingerprint = paymentMethod.card.fingerprint;
    const paymentMethodsToDelete = cards.data.filter(
      (method) => method.card?.fingerprint === fingerprint,
    );

    // Delete each payment method with the same fingerprint
    const deletionPromises = paymentMethodsToDelete.map(async (method) => {
      await stripeInstance.paymentMethods.detach(method.id);
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);
    return { status: true, message: 'Card is removed successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};
