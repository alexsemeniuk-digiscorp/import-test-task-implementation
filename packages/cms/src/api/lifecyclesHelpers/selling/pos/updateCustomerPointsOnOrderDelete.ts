import { handleLogger } from '../../../../graphql/helpers/errors';
import { roundPoints } from '../../../../utils/points';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateCustomerPointsOnOrderDelete = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook updateCustomerPointsOnOrderDelete',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  if (!currentOrder.points || currentOrder.points === 0) return;

  const companyService = strapi.service('api::company.company');
  const contactService = strapi.service('api::contact.contact');

  if (currentOrder.company && currentOrder.company.id) {
    const companyPoints = currentOrder.company.points ?? 0;

    await companyService.update(currentOrder.company.id, {
      data: {
        points: roundPoints(Number(companyPoints + currentOrder.points)),
      },
    });
  }

  if (currentOrder.contact && currentOrder.contact.id) {
    const contactPoints = currentOrder.contact.points ?? 0;

    await contactService.update(currentOrder.contact.id, {
      data: {
        points: roundPoints(Number(contactPoints + currentOrder.points)),
      },
    });
  }
};
