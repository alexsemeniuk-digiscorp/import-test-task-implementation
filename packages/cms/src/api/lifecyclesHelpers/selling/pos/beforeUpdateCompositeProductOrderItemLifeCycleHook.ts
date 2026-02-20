import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateProductOrderItemsInsideComposite } from '../../../lifecyclesHelpers/selling/pos/updateProductOrderItemsInsideComposite';
import { updateFollowingActivityInExistingOrder } from '../../activity/updateFollowingActivityInExistingOrder';
import { salesItemReportChangeOnOrderUpdate } from '../../reports/salesItemReportChangeOnOrderUpdate';
import { LifecycleHook } from '../../types';
import { beforeUpdateCompositeProductOrderItemPopulation } from '../../variables';
import { updateOrderTotalOnOrderItemUpdate } from './updateOrderTotalOnOrderItemUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateCompositeProductOrderItemLifeCycleHook: LifecycleHook =
  async (event: BeforeLifecycleEvent) => {
    handleLogger(
      'info',
      'CompositeProductOrderItem beforeUpdateCompositeProductOrderItemLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const entityId = event.params.where?.id;
    const apiName = event.model.uid;

    const currentItemData = await strapi.entityService.findOne(
      apiName,
      entityId,
      {
        fields: ['id', 'quantity', 'price', 'status'],
        populate: beforeUpdateCompositeProductOrderItemPopulation as any,
      },
    );

    await updateOrderTotalOnOrderItemUpdate(event, currentItemData);
    await salesItemReportChangeOnOrderUpdate(event, currentItemData);
    await updateFollowingActivityInExistingOrder(event, currentItemData);
    await updateProductOrderItemsInsideComposite(event, currentItemData);
  };
