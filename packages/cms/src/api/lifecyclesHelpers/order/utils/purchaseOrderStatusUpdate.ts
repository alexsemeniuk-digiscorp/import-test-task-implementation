import { handleError } from './../../../../graphql/helpers/errors';

export const handleNoReceiveEventsStatusShipped = async ({
  order,
  entityId,
}) => {
  try {
    if (!order || !entityId) {
      handleError(
        'handleNoReceiveEventsStatusShipped',
        'Missing required arguments: order, entityId, or strapi instance.',
      );
    }

    const productUpdates = order?.products?.map(async (productOrderItem) => {
      const productInventoryItem = productOrderItem.product;

      if (!productInventoryItem) {
        throw new Error(
          `Product inventory item for order product item with ID ${productOrderItem.id} not found`,
        );
      }

      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productInventoryItem.id,
        {
          data: {
            quantity: productInventoryItem.quantity + productOrderItem.quantity,
          },
        },
      );

      await strapi.entityService.create(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          data: {
            order: entityId,
            eventType: 'receive',
            change: productOrderItem?.quantity?.toString(),
            remainingQuantity: productOrderItem?.quantity,
            productInventoryItem: productInventoryItem.id,
            addedBy: order?.sales?.id,
            businessLocation: order?.businessLocation?.id,
            tenant: order.tenant.id,
            itemCost: productOrderItem?.price,
            itemVendor: order?.company?.id ?? null,
            itemContactVendor: order?.contact?.id ?? null,
            memo: !!order?.memo,
            expiryDate: order?.memo
              ? new Date(Date.now() + order.memo * 24 * 60 * 60 * 1000)
              : null,
            receiveDate: new Date(),
          },
        },
      );
    });

    await Promise.all(productUpdates);
  } catch (e) {
    handleError('handleNoReceiveEventsStatusShipped', undefined, e);
  }
};

export const handleReceiveEventsForShippedOrder = async ({
  receiveEvents,
  order,
  data,
}) => {
  try {
    if (!receiveEvents || !order || !data) {
      throw new Error(
        'Missing required arguments: receiveEvents, order, data, or strapi instance.',
      );
    }

    if (
      receiveEvents?.length > 0 &&
      order.status === 'shipped' &&
      data.status !== 'shipped'
    ) {
      await Promise.all(
        receiveEvents.map(async (event) => {
          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            event?.productInventoryItem?.id,
            {
              data: {
                quantity:
                  event?.productInventoryItem?.quantity -
                  event?.remainingQuantity,
              },
            },
          );

          await strapi.entityService.delete(
            'api::product-inventory-item-event.product-inventory-item-event',
            event.id,
          );
        }),
      );
    }
  } catch (e) {
    handleError('handleReceiveEventsForShippedOrder', undefined, e);
  }
};

export const createDealTransactionInPurchaseStatusUpdating = async ({
  order,
  data,
  chartAccounts,
  generateId,
}) => {
  try {
    if (!order || !data || !generateId) {
      throw new Error(
        'Missing required arguments: order, data, strapi, or generateId.',
      );
    }

    if (
      order?.dealTransactions?.length === 0 &&
      (data.status === 'placed' || data.status === 'shipped')
    ) {
      if (!order?.tenant?.id) throw new Error('tenant id is missing');

      const cashPaymentMethod = await strapi.entityService.findMany(
        'api::payment-method.payment-method',
        {
          filters: {
            name: {
              $eq: 'cash',
            },
            tenant: {
              id: {
                $eq: order.tenant.id,
              },
            },
          },
          fields: ['id'],
        },
      );

      await strapi.entityService.create(
        'api::deal-transaction.deal-transaction',
        {
          data: {
            sellingOrder: order.id,
            summary: order.total,
            paid: 0,
            status: 'Open',
            dueDate: new Date(),
            repetitive: 'once',
            dealTransactionId: generateId(),
            tenant: order.tenant.id,
            chartAccount: chartAccounts?.[0]?.id,
            paymentMethod: cashPaymentMethod?.[0]?.id,
            businessLocation: order?.businessLocation?.id,
          },
        },
      );
    }
  } catch (e) {
    handleError(e, undefined, 'createDealTransactionInPurchaseStatusUpdating');
  }
};
