import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';
import { CancelPaymentIntentForPosInput } from '../order.types';

export const cancelPaymentIntentForPos: GraphQLFieldResolver<
  null,
  null,
  { input: CancelPaymentIntentForPosInput }
> = async (root, { input }): Promise<any> => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });

    //cancel terminal action
    await stripeInstance.terminal.readers.cancelAction(input.terminalId, {
      stripeAccount: input.accountId,
    });

    await stripeInstance.paymentIntents.cancel(input.paymentIntentId, {
      stripeAccount: input.accountId,
    });

    return {
      status: true,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
