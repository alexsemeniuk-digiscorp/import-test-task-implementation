import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const quantityOnOrder: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  if (!root.id) return;

  const productServices = strapi.service('api::product.product');

  return productServices.getQuantityOnOrder(root.id, args.businessLocationId);
};
