import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const totalPricePerItem: GraphQLFieldResolver<
  NexusGenRootTypes['ProductOrderItem'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  const productOrderItemService = strapi.service(
    'api::product-order-item.product-order-item',
  );

  return productOrderItemService.getTotalPricePerItem(root.id);
};
