import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const quantity: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number; sublocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  return productService.getQuantity(
    root.id,
    args.businessLocationId,
    args.sublocationId,
  );
};
