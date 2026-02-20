import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const estimateToSellOrderUpdate = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeUpdateOrderLifecycleHook estimateToSellOrderUpdate',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const products = currentOrder?.products ?? [];

  if (products.length === 0) {
    return;
  }

  const insufficientItems: string[] = [];

  for (const orderProduct of products) {
    const inventoryItem = orderProduct?.product;
    const orderQuantity = orderProduct?.quantity ?? 0;
    const inventoryQuantity = inventoryItem?.quantity ?? 0;
    const isNegativeCount = inventoryItem?.isNegativeCount ?? false;
    const productName = inventoryItem?.product?.name ?? '';

    if (isNegativeCount) {
      continue;
    }

    if (inventoryQuantity < orderQuantity) {
      insufficientItems.push(
        `Product '${productName}': requested ${orderQuantity}, available ${inventoryQuantity}`,
      );
    }
  }

  if (insufficientItems.length > 0) {
    handleError(
      'estimateToSellOrderUpdate',
      `Insufficient inventory for the following items: ${insufficientItems.join(
        '; ',
      )}`,
      new Error('Insufficient inventory'),
      true,
    );
    return;
  }

  const productInventoryEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const ctx = strapi.requestContext.get();
  const userId = currentOrder?.sales?.id ?? ctx?.state?.user?.id;

  for (const orderProduct of products) {
    const inventoryItem = orderProduct?.product;
    const orderQuantity = orderProduct?.quantity ?? 0;

    if (!inventoryItem?.id) {
      continue;
    }

    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      inventoryItem.id,
      {
        data: {
          quantity: inventoryItem.quantity - orderQuantity,
        },
      },
    );

    const { updatedReceiveEvents } =
      await productInventoryEventService.removeRemainingInReceiveEvents({
        productItemId: inventoryItem.id,
        transferQuantity: orderQuantity,
      });

    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'pos order item add',
          change: orderQuantity.toString(),
          productInventoryItem: inventoryItem.id,
          ...(userId && { addedBy: userId }),
          businessLocation: currentOrder?.businessLocation?.id,
          tenant: currentOrder?.tenant?.id,
          ...(currentOrder?.contact?.id && {
            itemContactVendor: currentOrder.contact.id,
          }),
          ...(currentOrder?.company?.id && {
            itemVendor: currentOrder.company.id,
          }),
        },
      },
    );

    await Promise.all(
      updatedReceiveEvents.map(async (receiveEvent) =>
        strapi.entityService.update(
          'api::product-inventory-item-event.product-inventory-item-event',
          receiveEvent.id,
          {
            data: {
              remainingQuantity: receiveEvent.remainingQuantity,
            },
          },
        ),
      ),
    );
  }
};
