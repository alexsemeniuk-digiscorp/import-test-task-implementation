import { handleLogger } from '../../../graphql/helpers/errors';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createFollowingActivityInExistingOrder = async (
  { params }: AfterLifecycleEvent,
  currentOrder,
) => {
  // Skip create following activity in existing order during bulk imports for performance
  if (params?.data?._skipCreateFollowingActivityInExistingOrder) {
    delete params?.data?._skipCreateFollowingActivityInExistingOrder;
    return;
  }

  handleLogger(
    'info',
    'ProductOrderItem afterCreateOrderItemLifeCycleHook createFollowingActivityInExistingOrder',
    `Params :: ${JSON.stringify(params)}`,
  );

  const isNotDraft = currentOrder?.status !== 'draft';
  const isCompanyORContact =
    currentOrder?.company?.id || currentOrder?.contact?.id;

  const currentActivity = await strapi.entityService.findMany(
    'api::activity.activity',
    {
      filters: { order: { id: { $eq: currentOrder?.id } } },
      fields: ['id'],
    },
  );

  if (currentActivity.length) return;

  if (isCompanyORContact && currentOrder?.type === 'sell' && isNotDraft) {
    await strapi.entityService.create('api::activity.activity', {
      data: {
        customCreationDate:
          currentOrder?.customCreationDate ?? currentOrder?.createdAt,
        due_date: currentOrder?.customCreationDate ?? new Date(),
        title: 'Purchase',
        contact_id: currentOrder.contact?.id ?? undefined,
        company_id: currentOrder.company?.id ?? undefined,
        amount: currentOrder.total,

        completed: true,
        description: ``,
        notes: ``,
        type: 'purchase',
        tenant: currentOrder.tenant?.id ?? undefined,
        order: currentOrder?.id,
      },
    });
  }
};
