import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';
import { discountPopulation } from '../../discount/helpers/variables';
import { taxPopulation } from '../../tax/helpers/variables';

export const taxAmountPerItem: GraphQLFieldResolver<
  NexusGenRootTypes['ServiceOrderItem'] & { id: number },
  Graphql.ResolverContext
> = async (root) => {
  const taxService = strapi.service('api::tax.tax');

  const orderItem = await strapi.entityService.findOne(
    'api::service-order-item.service-order-item',
    root.id,
    {
      fields: ['price', 'quantity'],
      populate: {
        order: {
          fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
        },
        discounts: discountPopulation as any,
        tax: taxPopulation as any,
        taxCollection: {
          populate: {
            taxes: taxPopulation as any,
          },
        },
      },
    },
  );

  return taxService.getTaxAmountPerItem(orderItem);
};
