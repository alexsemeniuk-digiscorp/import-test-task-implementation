import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const getCreateDate: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  any
> = async (root): Promise<number> => {
  return root.customCreationDate || root.createdAt || new Date().getTime();
};
