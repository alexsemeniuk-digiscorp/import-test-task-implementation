import { GraphQLFieldResolver } from 'graphql';
import { handleLogger } from '../../../../graphql/helpers/errors';

import { InventoryPurchaseFormInput } from '../order.types';

export const inventoryPurchaseFormMutation: GraphQLFieldResolver<
  null,
  null,
  { input: InventoryPurchaseFormInput }
> = async (root, { input }, ctx, info) => {
  handleLogger(
    'info',
    'Resolver :: inventoryPurchaseFormMutation',
    `Input: ${JSON.stringify(input)}`,
  );
};
