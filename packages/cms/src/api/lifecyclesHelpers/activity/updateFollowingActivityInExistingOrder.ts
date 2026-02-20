import { handleLogger } from '../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateFollowingActivityInExistingOrder = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeUpdateOrderItemLifeCycleHook updateFollowingActivityInExistingOrder',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  if (!currentItemData?.order?.id) return;

  const isNotDraft = currentItemData?.order?.status !== 'draft';
  const isCompanyORContact =
    currentItemData?.order?.company?.id || currentItemData?.order?.contact?.id;

  const currentActivity = await strapi.entityService.findMany(
    'api::activity.activity',
    {
      filters: { order: { id: { $eq: currentItemData?.order?.id } } },
      fields: ['id'],
    },
  );

  if (currentActivity.length) return;

  if (
    isCompanyORContact &&
    currentItemData?.order?.type === 'sell' &&
    isNotDraft
  ) {
    await strapi.entityService.create('api::activity.activity', {
      data: {
        title: 'Purchase',
        customCreationDate:
          currentItemData?.order?.customCreationDate ??
          currentItemData?.order?.createdAt,
        due_date: currentItemData?.order?.customCreationDate ?? new Date(),
        contact_id: currentItemData?.order?.contact?.id ?? undefined,
        company_id: currentItemData?.order?.company?.id ?? undefined,
        amount: currentItemData?.order?.total ?? 0,
        completed: true,
        description: ``,
        notes: ``,
        type: 'purchase',
        tenant: currentItemData?.order?.tenant?.id ?? undefined,
        order: currentItemData?.order?.id,
      },
    });
  }
};
