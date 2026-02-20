import { handleLogger } from '../../../graphql/helpers/errors';
import { deleteOrderActivity } from '../order/deleteOrderActivity';
import { deletePurchaseOrderData } from '../order/deletePurchaseOrderData';
import { deleteSalesItemReportItems } from '../reports/deleteSalesItemReportItems';
import { addDeleteOrderEvent } from '../selling/pos/addDeleteOrderEvent';
import { deleteOrderItems } from '../selling/pos/deleteOrderItems';
import { updateCustomerPointsOnOrderDelete } from '../selling/pos/updateCustomerPointsOnOrderDelete';
import { LifecycleHook } from '../types';
import { beforeDeleteOrderPopulation } from '../variables';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeDeleteOrderLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const orderId = event?.params?.where?.id;

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderId,
    {
      fields: ['id', 'points', 'type'],
      populate: beforeDeleteOrderPopulation as any,
    },
  );

  await addDeleteOrderEvent({ ...event });
  await deleteOrderItems(event, currentOrder);
  await updateCustomerPointsOnOrderDelete(event, currentOrder);
  await deleteSalesItemReportItems({ ...event });
  await deletePurchaseOrderData(event, currentOrder);
  await deleteOrderActivity({ ...event });
};
