import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const addDeleteOrderEvent: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook deleteOrderItems',
    `Params :: ${JSON.stringify(params)}`,
  );

  const orderId = params.where.id;
  await strapi.entityService.update('api::order.order', orderId, {
    data: {
      billDeletetion: true,
    },
  });
};
