import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { discountPopulation } from '../../discount/helpers/variables';

export const pointsAmountPerItem: GraphQLFieldResolver<
  NexusGenRootTypes['MembershipOrderItem'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  const orderService = strapi.service('api::order.order');

  const orderItem = await strapi.entityService.findOne(
    'api::membership-order-item.membership-order-item',
    root.id,
    {
      fields: ['price'],
      populate: {
        order: {
          fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
        },
        discounts: discountPopulation as any,
      },
    },
  );

  return orderService.getPointsAmountPerItem(orderItem);
};
