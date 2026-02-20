import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { deleteSalesItemReportItemsByOrderItem } from '../../reports/deleteSalesItemReportItemsByOrderItem';
import { LifecycleHook } from '../../types';
import { beforeDeleteOrderItemPopulation } from '../../variables';
import { updateOrderCalculationsBeforeItemDelete } from './updateOrderCalculationsBeforeItemDelete';
import { updateOrderTotalOnOrderItemDelete } from './updateOrderTotalOnOrderItemDelete';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeDeleteServiceOrderItemLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ServiceOrderItem beforeDeleteServiceOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const entityId = event.params.where?.id;
  const apiName = event.model.uid;

  const currentItemData = await strapi.entityService.findOne(
    apiName,
    entityId,
    {
      fields: ['id', 'quantity', 'price', 'status', 'itemId'],
      populate: beforeDeleteOrderItemPopulation as any,
    },
  );

  await updateOrderTotalOnOrderItemDelete(event, currentItemData);
  await deleteSalesItemReportItemsByOrderItem({ ...event });
  await updateFollowingActivityInExistingOrder(event, currentItemData);
  await updateOrderCalculationsBeforeItemDelete(event, currentItemData);
};
