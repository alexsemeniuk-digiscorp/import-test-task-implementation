import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { updateHistoryEventOnReceivedPurchaseOrderChange } from '../../inventory/updateHistoryEventOnReceivedPurchaseOrderChange';
import { salesItemReportChangeOnOrderUpdate } from '../../reports/salesItemReportChangeOnOrderUpdate';
import { LifecycleHook } from '../../types';
import { beforeUpdateProductOrderItemPopulation } from '../../variables';
import { moveSerialNumbers } from './moveSerialNumbers';
import { updateOrderTotalOnOrderItemUpdate } from './updateOrderTotalOnOrderItemUpdate';
import { updateProductOrderItemSublocationQuantity } from './updateProductOrderItemSublocationQuantity';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateOrderItemLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeUpdateOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const entityId = event.params.where?.id;
  const apiName = event.model.uid;

  const entitySerialNumbers = event.params?.data?.serializes;

  const currentItemData = await strapi.entityService.findOne(
    apiName,
    entityId,
    {
      fields: ['id', 'quantity', 'price', 'isCompositeProductItem', 'status'],
      populate: beforeUpdateProductOrderItemPopulation as any,
    },
  );

  if (entitySerialNumbers) {
    await moveSerialNumbers(event, currentItemData, entitySerialNumbers);
  }

  await updateOrderTotalOnOrderItemUpdate(event, currentItemData);
  await salesItemReportChangeOnOrderUpdate(event, currentItemData);
  await updateFollowingActivityInExistingOrder(event, currentItemData);
  await updateHistoryEventOnReceivedPurchaseOrderChange(event, currentItemData);
  await updateProductOrderItemSublocationQuantity(event, currentItemData);
};
