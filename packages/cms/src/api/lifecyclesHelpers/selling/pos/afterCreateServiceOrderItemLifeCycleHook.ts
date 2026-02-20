import { handleLogger } from '../../../../graphql/helpers/errors';
import { createFollowingActivityInExistingOrder } from '../../../lifecyclesHelpers/activity/createFollowingActivityInExistingOrder';
import { createSalesItemReportInExistingOrder } from '../../../lifecyclesHelpers/reports/createSalesItemReportInExistingOrder';
import { addTaskForServicePerformerOnOrderEdit } from '../../../lifecyclesHelpers/selling/pos/addTaskForServicePerformerOnOrderEdit';
import { updateOrderCalculationsAfterItemUpdate } from '../../../lifecyclesHelpers/selling/pos/updateOrderCalculationsAfterItemUpdate';
import {
  afterCreateOrderItemOrderFields,
  afterCreateOrderItemOrderPopulation,
  afterCreateOrderItemPopulation,
} from '../../../lifecyclesHelpers/variables';
import { LifecycleHook } from '../../types';
import { updateOrderTotalOnNewOrderItemAdd } from './updateOrderTotalOnNewOrderItemAdd';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterCreateServiceOrderItemLifeCycleHook: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ServiceOrderItem afterCreateServiceOrderItemLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const apiName = event.model.uid;
  const entityId = event.params.where?.id || event.result?.id;
  const orderId = event?.params?.data?.order;

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
  await updateOrderTotalOnNewOrderItemAdd('services')(
    event,
    currentOrder,
    currentItemData,
  );
  await createSalesItemReportInExistingOrder(event, currentOrder);
  await createFollowingActivityInExistingOrder(event, currentOrder);
  await addTaskForServicePerformerOnOrderEdit(
    event,
    currentOrder,
    currentItemData,
  );
};
