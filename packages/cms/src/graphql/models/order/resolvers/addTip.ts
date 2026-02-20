import { GraphQLFieldResolver } from 'graphql';

import { OrderTipInput } from '../order.types';

export const addTip: GraphQLFieldResolver<
  null,
  null,
  { input: OrderTipInput }
> = async (root, { input }, ctx, info) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    { fields: ['total', 'tip'] },
  );

  return await strapi.entityService.update('api::order.order', input.orderId, {
    data: {
      total: input.isResetTip
        ? order.total
        : order.total - order.tip + input.tip,
      tip: input.tip,
    },
  });
};
