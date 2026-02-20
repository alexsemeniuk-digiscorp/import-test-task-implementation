import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { getPreviousWeekRange } from '../../../helpers/time';

export const quantitySoldLastWeek: GraphQLFieldResolver<
  NexusGenRootTypes['Product'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productService = strapi.service('api::product.product');

  const previousWeekRange = getPreviousWeekRange();

  return await productService.getQuantitySold(
    root.id,
    previousWeekRange.startDate,
    previousWeekRange.endDate,
    args.businessLocationId,
  );
};
