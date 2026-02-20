import { handleLogger } from '../../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { updateProductOrderItems } from './updateProductOrderItems';
import { updateSublocationItemsInOrderItems } from './updateSublocationItemsInOrderItems';

export const updatedOrderStatus = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'Lifecycle Helpers :: updatedOrderStatus',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const newStatus =
    event?.params?.data?.status ?? event.params?.data?.data?.status;

  if (newStatus === 'shipped' && newStatus !== currentOrder.status) {
    event.params.data.shippedDate =
      event?.params?.data?.updatedAt ?? new Date();
  }

  if (newStatus === 'received' && newStatus !== currentOrder.status) {
    event.params.data.receiveDate =
      event?.params?.data?.updatedAt ?? new Date();
  }

  if (
    currentOrder.status === 'received' &&
    currentOrder.status !== newStatus &&
    newStatus
  ) {
    await updateSublocationItemsInOrderItems(event, currentOrder);
    await updateProductOrderItems(event, currentOrder);
  }
};
