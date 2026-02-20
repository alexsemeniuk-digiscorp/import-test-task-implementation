import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { salesItemReportChangeOnOrderUpdate } from '../../reports/salesItemReportChangeOnOrderUpdate';
import { LifecycleHook } from '../../types';
import { beforeUpdateOrderItemPopulation } from '../../variables';
import { updateOrderTotalOnOrderItemUpdate } from './updateOrderTotalOnOrderItemUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateClassOrderItemLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ClassOrderItem beforeUpdateClassOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const entityId = event.params.where?.id;
  const apiName = event.model.uid;

  const currentItemData = await strapi.entityService.findOne(
    apiName,
    entityId,
    {
      fields: ['id', 'quantity', 'price', 'status'],
      populate: beforeUpdateOrderItemPopulation as any,
    },
  );

  await updateOrderTotalOnOrderItemUpdate(event, currentItemData);
  await salesItemReportChangeOnOrderUpdate(event, currentItemData);
  await updateFollowingActivityInExistingOrder(event, currentItemData);
};
