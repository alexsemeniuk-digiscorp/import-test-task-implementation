import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const totalPrice: GraphQLFieldResolver<
  NexusGenRootTypes['ProductOrderItem'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  const productOrderItemService = strapi.service(
    'api::product-order-item.product-order-item',
  );

  return productOrderItemService.getTotalPrice(root.id, root.quantity);
};
