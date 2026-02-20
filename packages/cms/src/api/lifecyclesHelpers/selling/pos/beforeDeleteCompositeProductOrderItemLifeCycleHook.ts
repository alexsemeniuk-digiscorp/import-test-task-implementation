import { handleLogger } from '../../../../graphql/helpers/errors';
import { deleteProductOrderItemsFromComposite } from '../../../lifecyclesHelpers/selling/pos/deleteProductOrderItemsFromComposite';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { deleteSalesItemReportItemsByOrderItem } from '../../reports/deleteSalesItemReportItemsByOrderItem';
import { LifecycleHook } from '../../types';
import { beforeDeleteCompositeProductOrderItemPopulation } from '../../variables';
import { updateOrderCalculationsBeforeItemDelete } from './updateOrderCalculationsBeforeItemDelete';
import { updateOrderTotalOnOrderItemDelete } from './updateOrderTotalOnOrderItemDelete';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeDeleteCompositeProductOrderItemLifeCycleHook: LifecycleHook =
  async (event: BeforeLifecycleEvent) => {
    handleLogger(
      'info',
      'CompositeProductOrderItem beforeDeleteCompositeProductOrderItemLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const entityId = event.params.where?.id;
    const apiName = event.model.uid;

    const currentItemData = await strapi.entityService.findOne(
      apiName,
      entityId,
      {
        fields: ['id', 'quantity', 'price', 'status', 'itemId'],
        populate: beforeDeleteCompositeProductOrderItemPopulation as any,
      },
    );

    await updateOrderTotalOnOrderItemDelete(event, currentItemData);
    await deleteSalesItemReportItemsByOrderItem({ ...event });
    await deleteProductOrderItemsFromComposite(event, currentItemData);
    await updateFollowingActivityInExistingOrder(event, currentItemData);
    await updateOrderCalculationsBeforeItemDelete(event, currentItemData);
  };
