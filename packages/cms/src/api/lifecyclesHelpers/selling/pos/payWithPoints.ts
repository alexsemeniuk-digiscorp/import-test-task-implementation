import { roundPoints } from '../../../../utils/points';
import {
  handleError,
  handleLogger,
} from './../../../../graphql/helpers/errors';

export const payWithPoints = async ({ params }, currentOrder) => {
  handleLogger(
    'info',
    'ORDER payWithPoints',
    `Params :: ${JSON.stringify(params)}`,
  );
  try {
    if (
      currentOrder.status === 'draft' &&
      params.data.status &&
      params.data.status !== 'draft' &&
      currentOrder.type === 'tradeIn'
    ) {
      const roundedTotal = roundPoints(Number(currentOrder.total));

      if (currentOrder.contact?.id) {
        await strapi.entityService.update(
          'api::contact.contact',
          currentOrder.contact.id,
          {
            data: {
              points: roundPoints(
                Number(currentOrder.contact.points + roundedTotal),
              ),
            },
          },
        );
      }

      if (currentOrder.company?.id) {
        await strapi.entityService.update(
          'api::company.company',
          currentOrder.company.id,
          {
            data: {
              points: roundPoints(
                Number(currentOrder.company.points + roundedTotal),
              ),
            },
          },
        );
      }

      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: `Points Change +${roundedTotal}`,
          contact_id: currentOrder.contact?.id ?? undefined,
          company_id: currentOrder.company?.id ?? undefined,
          amount: roundedTotal,
          due_date: new Date(),
          completed: true,
          description: `Customer was given ${roundedTotal} points due to Trade In order ID ${currentOrder.orderId}`,
          type: 'points',
          tenant: currentOrder.tenant?.id ?? undefined,
        },
      });
    }
  } catch (e) {
    handleError('payWithPoints', undefined, e);
  }
};
