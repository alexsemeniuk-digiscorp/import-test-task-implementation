import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { STRIPE_SECRET_KEY } from '../../../constants';

export const getPosTerminalList: GraphQLFieldResolver<
  NexusGenRootTypes['Order'] & { limitCount: number },
  Graphql.ResolverContext,
  { input: { accountId: string } }
> = async (root, { input }): Promise<any> => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });

    const terminals = await stripeInstance.terminal.readers.list(
      {},
      {
        stripeAccount: input.accountId,
      },
    );

    return terminals;
  } catch (error) {
    // Handle the error here
    throw new Error(error.message);
  }
};
