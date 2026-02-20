import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';
import { CardListArgsInputType } from '../types/types';
export const getSavedCards: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: CardListArgsInputType }
> = async (root, { input }) => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });
    const existingCustomers = await stripeInstance.customers.list(
      {
        email: input.email,
      },
      { stripeAccount: input.accountId },
    );
    const cards = await stripeInstance.customers.listPaymentMethods(
      existingCustomers.data[0]?.id,
      {
        type: 'card',
      },
    );
    const filteredCards = cards.data.filter(
      (card) => card.billing_details.email && card.billing_details.name,
    );
    return {
      data: filteredCards,
      customerId: existingCustomers.data[0]?.id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
