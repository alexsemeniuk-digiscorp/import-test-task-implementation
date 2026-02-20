import { handleLogger } from '../../../../graphql/helpers/errors';
import { createFollowingActivityInReturn } from '../../activity/createFollowingActivityInReturn';
import { LifecycleHook } from '../../types';
import { updateOrderItemsQuantityOnFullReturn } from './updateOrderItemsQuantityOnFullReturn';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterCreateReturnLifecycleHook: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  handleLogger(
    'info',
    'RETURN afterCreateReturnLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const entityId = event?.result?.id;
  const returnType = event?.result?.type;

  const currentReturn = await strapi.entityService.findOne(
    'api::return.return',
    entityId,
    {
      fields: ['id', 'createdAt', 'returnDate'],
      populate: {
        order: {
          fields: ['status', 'type', 'total'],
          populate: {
            contact: {
              fields: ['id'],
            },
            company: {
              fields: ['id'],
            },
            ...(returnType === 'full' && {
              products: {
                fields: ['id', 'isCompositeProductItem'],
              },
              compositeProducts: {
                fields: ['id'],
              },
              services: {
                fields: ['id'],
              },
              memberships: {
                fields: ['id'],
              },
              classes: {
                fields: ['id'],
              },
            }),
          },
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  await createFollowingActivityInReturn(event, currentReturn);

  if (returnType === 'full') {
    await updateOrderItemsQuantityOnFullReturn(event, currentReturn);
  }
};
