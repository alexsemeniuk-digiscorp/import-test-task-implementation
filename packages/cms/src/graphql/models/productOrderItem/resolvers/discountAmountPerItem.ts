import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { discountPopulation } from '../../discount/helpers/variables';

export const discountAmountPerItem: GraphQLFieldResolver<
  NexusGenRootTypes['ProductOrderItem'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  const discountServices = strapi.service('api::discount.discount');

  const orderItem = await strapi.entityService.findOne(
    'api::product-order-item.product-order-item',
    root.id,
    {
      fields: ['price', 'quantity'],
      populate: {
        order: {
          fields: ['subTotal'],
        },
        discounts: discountPopulation as any,
      },
    },
  );

  return discountServices.getDiscountAmountSumForOrderItem(
    orderItem.price,
    orderItem.quantity,
    orderItem.discounts,
    orderItem.order,
  );
};
