import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteOrderActivity: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook deleteOrderActivity',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const orderId = event.params.where.id;

  if (!orderId) return;

  const currentActivities = await strapi.entityService.findMany(
    'api::activity.activity',
    {
      filters: { order: { id: { $eq: orderId } } },
      fields: ['id'],
    },
  );

  if (!currentActivities.length) return;

  await strapi.entityService.delete(
    'api::activity.activity',
    currentActivities?.[0]?.id,
  );
};
