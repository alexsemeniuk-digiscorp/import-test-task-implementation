import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const totalQuantitySold: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  return await productService.getQuantitySold(
    root.id,
    undefined,
    undefined,
    args.businessLocationId,
  );
};
