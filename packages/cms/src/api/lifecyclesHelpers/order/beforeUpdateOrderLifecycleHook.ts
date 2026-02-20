import { LifecycleHook } from '../types';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { handleError, handleLogger } from '../../../graphql/helpers/errors';

import { updateOrderShipment } from '../customer-website/updateOrderShipment';
import { updateTransactionsOnOrderUpdate } from '../dealTransactions/updateTransactionsOnOrderUpdate';
import { updateProductInventoryItemRecordsAndSalesItemMemoSold } from '../inventory/updateProductInventoryItemRecordsAndSalesItemMemoSold';
import { createSalesItemReportItems } from '../reports/createSalesItemReportItems';
import { addOrderDueDate } from '../selling/pos/addOrderDueDate';
import { addTaskForServicePerformer } from '../selling/pos/addTaskForServicePerformer';
import { payWithPoints } from '../selling/pos/payWithPoints';
import {
  beforeUpdateOrderFields,
  beforeUpdateOrderPopulation,
} from '../variables';
import { addOrderRepairTicketNumber } from './beforeUpdate/addOrderRepairTicketNumber';
import { estimateToSellOrderUpdate } from './beforeUpdate/estimateToSellOrderUpdate';
import { purchaseOrderEventVendorUpdate } from './beforeUpdate/purchaseOrderEventVendorUpdate';
import { purchaseOrderMemoDaysUpdate } from './beforeUpdate/purchaseOrderMemoDaysUpdate';
import { purchaseOrderStatusUpdate } from './beforeUpdate/purchaseOrderStatusUpdate';
import { updateOrderCustomCreationDate } from './beforeUpdate/updateOrderCustomCreationDate';
import { updatedOrderStatus } from './beforeUpdate/updatedOrderStatus';
import { createTransactionForPaidOrder } from './createTransactionForPaidOrder';
import { memoToExpiryDate } from './memoToExpiryDate';
import { updateCustomerPoints } from './updateCustomerPoints';
import { updateFollowingActivity } from './updateFollowingActivity';
import { updateProductOrderItemPriceBasedOnCustomerPriceGroup } from './updateProductOrderItemPriceBasedOnCustomerPriceGroup';
import { updateTradeInVendor } from './updateTradeInVendor';

export const beforeUpdateOrderLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  // Skip full before update order during bulk imports for performance
  if (event?.params?.data?._skipFullBeforeUpdateOrder) {
    delete event?.params?.data?._skipFullBeforeUpdateOrder;
    return;
  }

  handleLogger(
    'info',
    'ORDER beforeUpdateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );
  const newOrderStatus =
    event?.params?.data?.status ?? event.params?.data?.data?.status;
  const newOrderType =
    event?.params?.data?.type ?? event.params?.data?.data?.type;

  const orderID = event?.params?.where?.id;

  if (!orderID) return;

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderID,
    {
      fields: beforeUpdateOrderFields as any,
      populate: beforeUpdateOrderPopulation as any,
    },
  );

  if (!currentOrder)
    return handleError(
      'ORDER beforeUpdateLifecycleHook',
      `Order ${orderID} was not found`,
    );

  await updateTransactionsOnOrderUpdate(event, currentOrder);

  // Skip before update order during bulk imports for performance
  if (event?.params?.data?._skipBeforeUpdateOrder) {
    delete event?.params?.data?._skipBeforeUpdateOrder;
    return;
  }

  if (currentOrder.type === 'estimate' && newOrderType === 'sell') {
    await estimateToSellOrderUpdate(event, currentOrder);
    return;
  }

  await updateProductOrderItemPriceBasedOnCustomerPriceGroup(
    event,
    currentOrder,
  );
  await updateCustomerPoints(event, currentOrder);
  await updateTradeInVendor(event, currentOrder);
  await updateOrderShipment(event, currentOrder);
  await addTaskForServicePerformer(event, currentOrder);
  await addOrderDueDate(event, currentOrder);
  await payWithPoints(event, currentOrder);
  await createSalesItemReportItems(event, currentOrder);
  await updateFollowingActivity(event, currentOrder);
  await memoToExpiryDate(event, currentOrder);
  await updateOrderCustomCreationDate(event, currentOrder);
  await updateProductInventoryItemRecordsAndSalesItemMemoSold(
    event,
    currentOrder,
  );
  await addOrderRepairTicketNumber(event, currentOrder);

  if (currentOrder.type === 'purchase') {
    await purchaseOrderStatusUpdate(event, currentOrder);
    await createTransactionForPaidOrder(event, currentOrder);
    await purchaseOrderEventVendorUpdate(event, currentOrder);
  }

  if (currentOrder.type === 'purchase' || currentOrder.type === 'tradeIn') {
    await purchaseOrderMemoDaysUpdate(event, currentOrder);
  }

  if (newOrderStatus !== currentOrder.status && newOrderStatus) {
    await updatedOrderStatus(event, currentOrder);
  }

  // Store previous status for afterUpdate hook to check status transitions
  event.state = {
    ...event.state,
    previousStatus: currentOrder.status,
  };
};
