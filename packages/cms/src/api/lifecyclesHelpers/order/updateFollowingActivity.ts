import { handleError, handleLogger } from './../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

const activityTitles: Record<string, string> = {
  sell: 'Purchase',
  layaway: 'Layaway',
  rent: 'Rent',
  tradeIn: 'Trade In',
};

export const updateFollowingActivity = async (
  { params }: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeUpdateOrderItemLifeCycleHook updateFollowingActivity',
    `Params :: ${JSON.stringify(params)}`,
  );

  try {
    const orderTypeWithActivity =
      currentOrder.type === 'sell' ||
      currentOrder.type === 'layaway' ||
      currentOrder.type === 'rent' ||
      currentOrder.type === 'tradeIn';
    const orderTypeTitle =
      activityTitles[currentOrder?.type] ?? 'Unknown Order';
    const currentActivity = await strapi.entityService.findMany(
      'api::activity.activity',
      {
        filters: { order: { id: { $eq: currentOrder?.id } } },
        fields: ['id', 'type'],
      },
    );

    const hasActivityPointsType = currentActivity.some(
      (item) => item.type === 'points',
    );

    if (
      currentOrder?.points &&
      params?.data?.status &&
      params?.data?.status !== 'draft' &&
      !hasActivityPointsType
    ) {
      const updatedEntityPoints =
        currentOrder?.contact?.points || currentOrder?.company?.points;
      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Points Change -${currentOrder.points}`,
          contact_id: currentOrder.contact?.id ?? undefined,
          company_id: currentOrder.company?.id ?? undefined,
          due_date: new Date(),
          completed: true,
          description: `Points balance has been changed to ${updatedEntityPoints} due to points usage in order ${currentOrder?.orderId}`,
          amount: updatedEntityPoints,
          priority: 'low',
          notes: ``,
          type: 'points',
          tenant: currentOrder.tenant?.id ?? undefined,
          order: currentOrder?.id,
        },
      });
    }

    const isNotDraft =
      params?.data?.status &&
      params?.data?.status !== 'draft' &&
      currentOrder?.status === 'draft';

    const hasActivityPurchaseType = currentActivity.some(
      (item) => item.type === 'purchase',
    );

    const isCompanyORContact =
      currentOrder?.company?.id || currentOrder?.contact?.id;

    if (
      isCompanyORContact &&
      orderTypeWithActivity &&
      isNotDraft &&
      !hasActivityPurchaseType
    ) {
      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: orderTypeTitle,
          contact_id: currentOrder.contact?.id ?? undefined,
          company_id: currentOrder.company?.id ?? undefined,
          amount: currentOrder.total,
          due_date: new Date(),
          completed: true,
          description: ``,
          notes: ``,
          type: 'purchase',
          tenant: currentOrder.tenant?.id ?? undefined,
          order: currentOrder?.id,
        },
      });
    }
  } catch (e) {
    handleError('updateFollowingActivity', undefined, e);
  }
};
