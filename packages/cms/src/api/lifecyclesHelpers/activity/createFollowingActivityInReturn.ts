import { handleLogger } from '../../../graphql/helpers/errors';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createFollowingActivityInReturn = async (
  { params }: AfterLifecycleEvent,
  currentReturn,
) => {
  handleLogger(
    'info',
    'Return afterCreateReturnLifeCycleHook createFollowingActivityInReturn',
    `Params :: ${JSON.stringify(params)}`,
  );

  const returnOrder = currentReturn?.order;
  const isNotDraft = returnOrder?.status !== 'draft';

  if (currentReturn && returnOrder?.type === 'sell' && isNotDraft) {
    await strapi.entityService.create('api::activity.activity', {
      data: {
        customCreationDate:
          currentReturn?.returnDate ?? currentReturn?.createdAt,
        due_date: currentReturn?.returnDate ?? new Date(),
        title: 'Return',
        contact_id: returnOrder?.contact?.id ?? undefined,
        company_id: returnOrder?.company?.id ?? undefined,
        amount: returnOrder.total,
        completed: true,
        description: ``,
        notes: ``,
        type: 'return',
        tenant: currentReturn?.tenant?.id ?? undefined,
        returnInfo: currentReturn?.id,
      },
    });
  }
};
