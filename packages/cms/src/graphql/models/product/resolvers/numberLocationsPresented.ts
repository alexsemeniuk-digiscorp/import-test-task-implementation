import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const numberLocationsPresented: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  return productService.getNumberLocationsPresented(
    root.id,
    args.businessLocationId,
  );
};
