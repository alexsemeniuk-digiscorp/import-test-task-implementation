import { handleError, handleLogger } from './../../../graphql/helpers/errors';

export const createPurchaseOrderActivity = async (event, currentOrder) => {
  try {
    handleLogger(
      'info',
      'Order AfterCreate createPurchaseOrderActivity',
      `Params:${JSON.stringify(event.params)}`,
    );

    const isCompanyORContact =
      currentOrder?.company?.id || currentOrder?.contact?.id;

    const orderType =
      currentOrder?.type === 'sell' && currentOrder?.status !== 'draft';

    if (isCompanyORContact && orderType) {
      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: 'Purchase',
          customCreationDate:
            currentOrder?.customCreationDate ?? currentOrder?.createdAt,
          due_date: currentOrder?.customCreationDate ?? new Date(),
          contact_id: currentOrder?.contact?.id ?? undefined,
          company_id: currentOrder?.company?.id ?? undefined,
          amount: currentOrder?.total,
          completed: true,
          description: ``,
          notes: ``,
          type: 'purchase',
          tenant: currentOrder?.tenant?.id ?? undefined,
          order: currentOrder?.id,
        },
      });
    }
  } catch (e) {
    handleError('createPurchaseOrderActivity', undefined, e);
  }
};
