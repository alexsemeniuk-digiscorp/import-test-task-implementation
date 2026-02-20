import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const taxPortion: GraphQLFieldResolver<
  NexusGenRootTypes['Order'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<number> => {
  const orderService = strapi.service('api::order.order');

  return await orderService.getTaxPortion(
    root.id,
    root?.total ?? 0,
    root?.tax ?? 0,
  );
};
