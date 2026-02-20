import { handleLogger } from '../../../../graphql/helpers/errors';
import { addTaskForServicePerformerOnOrderEditItemUpdate } from '../../../lifecyclesHelpers/selling/pos/addTaskForServicePerformerOnOrderEditItemUpdate';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { salesItemReportChangeOnOrderUpdate } from '../../reports/salesItemReportChangeOnOrderUpdate';
import { LifecycleHook } from '../../types';
import { beforeUpdateOrderItemPopulation } from '../../variables';
import { updateOrderTotalOnOrderItemUpdate } from './updateOrderTotalOnOrderItemUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateServiceOrderItemLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ServiceOrderItem beforeUpdateServiceOrderItemLifeCycleHook',
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
        'itemId',
        'status',
        'quantity',
        'dueDate',
        'price',
        'note',
      ],
      populate: beforeUpdateOrderItemPopulation as any,
    },
  );

  await updateOrderTotalOnOrderItemUpdate(event, currentItemData);
  await salesItemReportChangeOnOrderUpdate(event, currentItemData);
  await updateFollowingActivityInExistingOrder(event, currentItemData);
  await addTaskForServicePerformerOnOrderEditItemUpdate(event, currentItemData);
};
