import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

const makeProperCustomerTaskConnection = (data) => {
  if (data?.company || data?.contact || data?.lead) {
    return {
      company: data?.company_id || null,
      contact: data?.contact_id || null,
      lead: data?.lead_id || null,
    };
  }
  return {};
};

const updateBusinessLocation = (data) => {
  if (data?.businessLocation) {
    return {
      businessLocation: data?.businessLocation ?? undefined,
    };
  }
  return {};
};

export const updateFollowingTask: LifecycleHook = async ({
  params,
}: AfterLifecycleEvent) => {
  handleLogger(
    'info',
    'ACTIVITY afterUpdate updateFollowingTask',
    `Params :: ${JSON.stringify(params)}`,
  );

  const activityId = params?.where?.id;
  const activityData = params?.data;

  const updatedActivity = await strapi.entityService.findOne(
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

  const connectedActivityId = updatedActivity?.task?.id;

  if (connectedActivityId) {
    // Skip meilisearch sync during bulk imports for performance
    const shouldSkipMeilisearchSync = params?.data?._skipMeilisearchSync
      ? {
          _skipMeilisearchSync: true,
        }
      : {};

    await strapi.entityService.update('api::task.task', connectedActivityId, {
      data: {
        name: activityData?.title ?? undefined,
        description: activityData?.description ?? undefined,
        notes: activityData?.notes ?? undefined,
        completed: activityData?.completed ?? undefined,
        dueDate: activityData?.due_date ?? undefined,
        priority: activityData?.priority ?? undefined,
        assignees: activityData?.assignees ?? undefined,
        note: activityData?.notes ?? undefined,
        ...updateBusinessLocation(activityData),
        ...makeProperCustomerTaskConnection(activityData),
        ...shouldSkipMeilisearchSync,
      },
    });

    if (params?.data?._skipMeilisearchSync) {
      delete params?.data?._skipMeilisearchSync;
    }
  }
};
