import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../constants';
import {
  CreateLocationForPosInput,
  CreateLocationForPosInputResponse,
} from '../order.types';

export const createLocationForPos: GraphQLFieldResolver<
  null,
  null,
  { input: CreateLocationForPosInput }
> = async (
  root,
  { input }: { input: CreateLocationForPosInput },
): Promise<CreateLocationForPosInputResponse> => {
  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      stripeAccount: input.accountId,
    });

    const { display_name, address, accountId, registration_code } = input;

    const location = await stripeInstance.terminal.locations.create(
      {
        display_name,
        address,
      },
      {
        stripeAccount: accountId,
      },
    );

    if (!location) {
      throw new Error('Location creation failed');
    }

    const reader = await stripeInstance.terminal.readers.create(
      {
        registration_code: registration_code,
        label: display_name,
        location: location.id,
      },
      {
        stripeAccount: accountId,
      },
    );

    return {
      locationId: reader.id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
