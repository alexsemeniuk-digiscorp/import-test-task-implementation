import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const tax: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  if (!args.businessLocationId) return undefined;

  return productService.getTax(root.id, args.businessLocationId);
};
