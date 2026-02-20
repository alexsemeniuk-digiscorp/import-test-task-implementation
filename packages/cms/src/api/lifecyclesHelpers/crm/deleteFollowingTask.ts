import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteFollowingTask: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  const activityId = params.where.id;

  const deleteActivity = await strapi.entityService.findOne(
    'api::activity.activity',
    activityId,
    {
      fields: ['id'],
      populate: {
        task: {
          fields: ['id'],
        },
      },
    },
  );

  const connectedTaskId = deleteActivity?.task?.id;
  if (connectedTaskId) {
    await strapi.entityService.delete('api::task.task', connectedTaskId);
  }
};
