import { LifecycleHook } from '../types';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { handleError, handleLogger } from '../../../graphql/helpers/errors';

import { removeSublocationItem } from './beforeUpdate/removeSublocationItem';

export const beforeUpdateSublocationItemLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'SublocationItem beforeUpdateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  /* general  data */
  const sublocationItemId = event?.params?.where?.id;
  const quantity = Number(event?.params?.data?.quantity);

  if (typeof quantity === 'number' && !isNaN(quantity)) {
    if (!sublocationItemId)
      return handleError(
        'SublocationItem beforeUpdateLifecycleHook',
        `SublocationItemId: ${sublocationItemId} was not found`,
      );

    const sublocationItem = await strapi.entityService.findOne(
      'api::sublocation-item.sublocation-item',
      sublocationItemId,
      {
        fields: ['id', 'quantity'],
      },
    );

    if (quantity === 0 || sublocationItem.quantity === 0) {
      await removeSublocationItem(event, sublocationItem);
    }
  }
};
