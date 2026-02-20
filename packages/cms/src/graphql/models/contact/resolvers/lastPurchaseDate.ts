import { GraphQLFieldResolver } from 'graphql';

import { DateTime } from '@strapi/strapi/lib/types/core/attributes';
import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const lastPurchaseDate: GraphQLFieldResolver<
  NexusGenRootTypes['Contact'] & { id: number },
  Graphql.ResolverContext,
  null
> = async (root): Promise<DateTime> => {
  const orderService = strapi.service('api::contact.contact');

  return orderService.getLastPurchaseDate(root.id);
};
