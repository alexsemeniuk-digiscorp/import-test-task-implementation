import { handleLogger } from '../../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const purchaseOrderMemoDaysUpdate = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeUpdateOrderLifecycleHook purchaseOrderMemoDaysUpdate',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const { data, where } = event.params;
  const entityId = where?.id;

  const updatedMemo = data?.memo;

  if (updatedMemo != null) {
    const receiveEvents = await strapi.entityService.findMany(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        filters: {
          order: entityId,
          eventType: 'receive',
        },
        fields: ['id'],
      },
    );

    if (receiveEvents && receiveEvents?.length > 0) {
      if (updatedMemo !== 0) {
        const expiryDate = new Date(
          currentOrder?.customCreationDate || currentOrder?.createdAt,
        );
        const memoDays = Number(updatedMemo);
        expiryDate.setDate(expiryDate.getDate() + memoDays);

        await Promise.all(
          receiveEvents.map(async (event) => {
            await strapi.entityService.update(
              'api::product-inventory-item-event.product-inventory-item-event',
              event?.id,
              {
                data: {
                  memo: true,
                  expiryDate,
                },
              },
            );
          }),
        );
      } else {
        await Promise.all(
          receiveEvents.map(async (event) => {
            await strapi.entityService.update(
              'api::product-inventory-item-event.product-inventory-item-event',
              event?.id,
              {
                data: {
                  memo: false,
                  expiryDate: null,
                },
              },
            );
          }),
        );
      }
    }
  }
};
