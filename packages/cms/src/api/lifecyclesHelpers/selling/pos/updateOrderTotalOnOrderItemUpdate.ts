import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { handleOrderItemQuantityOrPriceChanged } from '../pos/handleOrderItemQuantityOrPriceChanged';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateOrderTotalOnOrderItemUpdate = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  try {
    handleLogger(
      'info',
      'ProductOrderItem beforeUpdateOrderItemLifeCycleHook updateOrderTotalOnOrderItemUpdate',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const apiName = event?.model?.uid;

    const entityPrice = Number(
      event.params?.data?.price ?? event.params?.data?.data?.price,
    );

    const ctx = strapi.requestContext.get();
    const userId = ctx?.state?.user?.id;
    const originalUrl = ctx?.originalUrl;
    const isEntityPriceExist = entityPrice !== undefined && entityPrice >= 0;

    const excludeOrderType =
      currentItemData?.order?.type !== 'purchase' &&
      currentItemData?.order?.type !== 'estimate';
    if (!excludeOrderType) return;

    const entityQuantity =
      currentItemData?.order?.type !== 'tradeIn'
        ? Number(
            event.params?.data?.quantity ??
              event.params?.data?.data?.quantity ??
              currentItemData?.quantity ??
              1,
          )
        : Number(
            event.params?.data?.quantity ??
              event.params?.data?.data?.quantity ??
              currentItemData?.quantity ??
              0,
          );

    if (
      (entityQuantity !== undefined &&
        entityQuantity !== currentItemData.quantity) ||
      (isEntityPriceExist && entityPrice !== currentItemData.price)
    ) {
      await handleOrderItemQuantityOrPriceChanged({
        entityQuantity,
        currentItemData,
        excludeOrderType,
        apiName,
        userId,
        entityPrice,
        originalUrl,
      });
    }
  } catch (e) {
    handleError('updateOrderTotalOnOrderItemUpdate', undefined, e);
  }
};
