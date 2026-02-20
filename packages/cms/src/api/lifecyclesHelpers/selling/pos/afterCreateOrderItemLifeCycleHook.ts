import { handleLogger } from '../../../../graphql/helpers/errors';
import { createFollowingActivityInExistingOrder } from '../../../lifecyclesHelpers/activity/createFollowingActivityInExistingOrder';
import { createSalesItemReportInExistingOrder } from '../../../lifecyclesHelpers/reports/createSalesItemReportInExistingOrder';
import { updateOrderCalculationsAfterItemUpdate } from '../../../lifecyclesHelpers/selling/pos/updateOrderCalculationsAfterItemUpdate';
import {
  afterCreateOrderItemOrderFields,
  afterCreateOrderItemOrderPopulation,
  afterCreateOrderItemPopulation,
} from '../../../lifecyclesHelpers/variables';
import { LifecycleHook } from '../../types';
import { updateOrderTotalOnNewOrderItemAdd } from './updateOrderTotalOnNewOrderItemAdd';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterCreateOrderItemLifeCycleHook: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  // Skip after create order item during bulk imports for performance
  if (event?.params?.data?._skipAfterCreateOrderItem) {
    delete event?.params?.data?._skipAfterCreateOrderItem;
    return;
  }

  handleLogger(
    'info',
    'ProductOrderItem afterCreateOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const apiName = event.model.uid;
  const entityId = event.params.where?.id || event.result?.id;
  const orderId = event?.params?.data?.order;

  const currentItemData = await strapi.entityService.findOne(
    apiName,
    entityId,
    {
      fields: ['id', 'itemId', 'status'],
      populate: afterCreateOrderItemPopulation as any,
    },
  );

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderId,
    {
      fields: afterCreateOrderItemOrderFields as any,
      populate: afterCreateOrderItemOrderPopulation as any,
    },
  );

  await updateOrderCalculationsAfterItemUpdate(event, currentItemData);
  await updateOrderTotalOnNewOrderItemAdd('products')(
    event,
    currentOrder,
    currentItemData,
  );
  await createSalesItemReportInExistingOrder(event, currentOrder);
  await createFollowingActivityInExistingOrder(event, currentOrder);
};
