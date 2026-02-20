import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';

export const removePosLocation: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: { terminalId: string } }
> = async (root, { input }, ctx) => {
  try {
    const userService = await strapi
      .plugin('users-permissions')
      .service('user');
    const userDetail = await userService.fetch(ctx.state.user.id, {
      populate: ['tenant', 'tenant.stripe_onboarding', 'role'],
    });

    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: userDetail.tenant.stripe_onboarding.accountId,
    });
    // Fetch the terminal (reader) details to get the locationId
    const terminal = await stripeInstance.terminal.readers.retrieve(
      input.terminalId,
      {
        stripeAccount: userDetail.tenant.stripe_onboarding.accountId,
      },
    );

    // Delete the terminal
    await stripeInstance.terminal.readers.del(input.terminalId, {
      stripeAccount: userDetail.tenant.stripe_onboarding.accountId,
    });
    // Delete the terminal
    if ('location' in terminal) {
      await stripeInstance.terminal.locations.del(
        terminal?.location as string,
        {
          stripeAccount: userDetail.tenant.stripe_onboarding.accountId,
        },
      );
    }

    return { status: true };
  } catch (error) {
    throw new Error(error.message);
  }
};
