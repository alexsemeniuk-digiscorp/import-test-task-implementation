import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { deleteSalesItemReportItemsByOrderItem } from '../../reports/deleteSalesItemReportItemsByOrderItem';
import { LifecycleHook } from '../../types';
import { beforeDeleteProductOrderItemPopulation } from '../../variables';
import { moveSerialNumbersOnOrderItemDelete } from './moveSerialNumbersOnOrderItemDelete';
import { updateOrderCalculationsBeforeItemDelete } from './updateOrderCalculationsBeforeItemDelete';
import { updateOrderTotalOnOrderItemDelete } from './updateOrderTotalOnOrderItemDelete';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeDeleteOrderItemLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeDeleteOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const entityId = event.params.where?.id;
  const apiName = event.model.uid;

  const currentItemData = await strapi.entityService.findOne(
    apiName,
    entityId,
    {
      fields: [
        'id',
        'quantity',
        'price',
        'isCompositeProductItem',
        'status',
        'itemId',
      ],
      populate: beforeDeleteProductOrderItemPopulation as any,
    },
  );

  await moveSerialNumbersOnOrderItemDelete(event, currentItemData);
  await updateOrderTotalOnOrderItemDelete(event, currentItemData);
  await deleteSalesItemReportItemsByOrderItem({ ...event });
  await updateFollowingActivityInExistingOrder(event, currentItemData);
  await updateOrderCalculationsBeforeItemDelete(event, currentItemData);
};
