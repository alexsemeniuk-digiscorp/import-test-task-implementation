import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateProductOrderItemSublocationQuantity = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  try {
    handleLogger(
      'info',
      'ProductOrderItem beforeUpdateOrderItemLifeCycleHook updateProductOrderItemSublocationQuantity',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const excludeOrderType =
      currentItemData?.order?.type !== 'purchase' &&
      currentItemData?.order?.type !== 'estimate';

    if (!excludeOrderType) return;

    const sublocationIds =
      event.params?.data?.sublocations ??
      event.params?.data?.data?.sublocations ??
      [];

    if (sublocationIds.length === 0) return;

    let remainingToSubtract = Number(currentItemData?.quantity ?? 0);

    for (const sublocationId of sublocationIds) {
      if (remainingToSubtract <= 0) break;

      const currentSublocationItems = await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        {
          filters: {
            sublocation: { id: { $eq: sublocationId } },
            productInventoryItem: { id: { $eq: currentItemData?.product?.id } },
          },
          fields: ['id', 'quantity'],
        },
      );

      const sublocationItemUpdates = [];

      for (const currentSublocationItem of currentSublocationItems) {
        if (remainingToSubtract <= 0) break;

        const available = Number(currentSublocationItem?.quantity ?? 0);
        const subtract = Math.min(available, remainingToSubtract);

        sublocationItemUpdates.push(
          strapi.entityService.update(
            'api::sublocation-item.sublocation-item',
            currentSublocationItem.id,
            { data: { quantity: available - subtract } },
          ),
        );

        remainingToSubtract -= subtract;
      }

      await Promise.all(sublocationItemUpdates);
    }
  } catch (e) {
    handleError('updateProductOrderItemSublocationQuantity', undefined, e);
  }
};
