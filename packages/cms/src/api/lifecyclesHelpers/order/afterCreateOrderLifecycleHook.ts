import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

import { createPurchaseOrderActivity } from './createPurchaseOrderActivity';

export const afterCreateOrderLifecycleHook: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  // Skip after create order during bulk imports for performance
  if (event?.params?.data?._skipAfterCreateOrder) {
    delete event?.params?.data?._skipAfterCreateOrder;
    return;
  }

  handleLogger(
    'info',
    'ORDER afterCreateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );
  const entityId = event.result?.id;

  if (!entityId)
    return handleLogger(
      'warn',
      'ORDER afterCreateLifecycleHook',
      "ID wasn't provided",
    );

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    entityId,
    {
      fields: [
        'id',
        'type',
        'status',
        'customCreationDate',
        'createdAt',
        'total',
      ],
      populate: {
        contact: {
          fields: ['id'],
        },
        company: {
          fields: ['id'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  await createPurchaseOrderActivity(event, currentOrder);
};
