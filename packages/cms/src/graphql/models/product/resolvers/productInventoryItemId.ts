import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const productInventoryItemId: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  if (!args.businessLocationId) return '';

  return productService.getProductInventoryItemId(
    root.id,
    args.businessLocationId,
  );
};
