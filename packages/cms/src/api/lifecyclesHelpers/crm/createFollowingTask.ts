import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createFollowingTask: LifecycleHook = async ({
  params,
  result,
}: AfterLifecycleEvent) => {
  handleLogger(
    'info',
    'ACTIVITY afterCreate createFollowingTask',
    `Params :: ${JSON.stringify(params)}`,
  );

  const activityId = result?.id;
  const activityData = params?.data;

  if (!activityData?.task && activityData?.due_date) {
    const now = new Date();
    const activityDueDate = new Date(activityData?.due_date);
    const dateDiff = activityDueDate?.getTime() - now?.getTime();

    if (dateDiff < 0) return;

    // Skip meilisearch sync during bulk imports for performance
    const shouldSkipMeilisearchSync = params?.data?._skipMeilisearchSync
      ? {
          _skipMeilisearchSync: true,
        }
      : {};

    await strapi.entityService.create('api::task.task', {
      data: {
        name: activityData?.title ?? '',
        description: activityData?.description ?? '',
        dueDate:
          activityData?.due_date?.toISOString() ?? new Date().toISOString(),
        assignees: activityData.assignees?.length
          ? activityData.assignees
          : undefined,
        priority: activityData?.priority ?? undefined,
        note: activityData?.notes ?? '',
        activity: activityId,
        completed: !!activityData?.completed,
        company: activityData?.company_id ?? undefined,
        contact: activityData?.contact_id ?? undefined,
        lead: activityData?.lead_id ?? undefined,
        tenant: activityData?.tenant ?? undefined,
        appointmentDate: activityData?.appointmentDate ?? undefined,
        businessLocation: activityData?.businessLocation ?? undefined,
        ...shouldSkipMeilisearchSync,
      },
    });

    if (params?.data?._skipMeilisearchSync) {
      delete params?.data?._skipMeilisearchSync;
    }
  }
};
