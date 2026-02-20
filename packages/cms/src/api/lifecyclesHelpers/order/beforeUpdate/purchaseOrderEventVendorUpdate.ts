import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { NexusGenEnums } from '../../../../types/generated/graphql';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const purchaseOrderEventVendorUpdate = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  try {
    handleLogger(
      'info',
      'ORDER beforeUpdateOrderLifecycleHook purchaseOrderEventVendorUpdate',
      `Params: ${JSON.stringify(event.params)}`,
    );

    const newContactId =
      event?.params?.data?.contact ?? event.params?.data?.data?.contact;
    const newCompanyId =
      event?.params?.data?.company ?? event.params?.data?.data?.company;

    if (
      currentOrder?.status === 'received' &&
      ((newContactId && currentOrder?.contact?.id !== newContactId) ||
        (newCompanyId && currentOrder?.company?.id !== newCompanyId))
    ) {
      const receiveEvents = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            order: {
              id: {
                $eq: currentOrder?.id,
              },
            },
            eventType:
              'receive' as NexusGenEnums['ENUM_PRODUCTINVENTORYITEMEVENT_EVENTTYPE'],
          },
          fields: ['id'],
          populate: {
            itemVendor: {
              fields: ['id'],
            },
            itemContactVendor: {
              fields: ['id'],
            },
          },
        },
      );

      if (receiveEvents && receiveEvents?.length > 0) {
        await Promise.all(
          receiveEvents.map(
            async (receiveEvent) =>
              await strapi.entityService.update(
                'api::product-inventory-item-event.product-inventory-item-event',
                receiveEvent.id,
                {
                  data: {
                    itemVendor: newCompanyId ?? null,
                    itemContactVendor: newContactId ?? null,
                  },
                },
              ),
          ),
        );
      }
    }
  } catch (e) {
    handleError(e, undefined, 'purchaseOrderEventVendorUpdate');
  }
};
