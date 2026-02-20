import { handleLogger } from '../../../../graphql/helpers/errors';
import { generateId } from '../../../../utils/randomBytes';

import { last } from 'lodash';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const purchaseOrderStatusUpdate = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeUpdateOrderLifecycleHook purchaseOrderStatusUpdate',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const { data, where } = event.params;
  const entityId = where?.id;

  const chartAccounts = await strapi.entityService.findMany(
    'api::chart-account.chart-account',
    {
      filters: {
        name: 'Cost of Goods Sold',
      },
      fields: ['id'],
    },
  );

  const receiveEvents = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        order: entityId,
      },
      fields: ['id', 'remainingQuantity', 'change'],
      populate: {
        productInventoryItem: {
          fields: ['id', 'quantity'],
        },
      },
    },
  );

  if (receiveEvents?.length === 0 && data.status === 'received') {
    const productUpdates = currentOrder?.products?.map(
      async (productOrderItem) => {
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
              quantity:
                Number(productInventoryItem.quantity) +
                Number(productOrderItem.quantity),
            },
          },
        );

        const currentQuantity = Number(productInventoryItem.quantity) || 0;
        const numEventQuantity = Number(productOrderItem?.quantity) || 0;
        const remainingQuantity =
          currentQuantity < 0
            ? Math.max(0, numEventQuantity + currentQuantity)
            : numEventQuantity;

        await strapi.entityService.create(
          'api::product-inventory-item-event.product-inventory-item-event',
          {
            data: {
              order: entityId,
              eventType: 'receive',
              change: productOrderItem?.quantity?.toString(),
              remainingQuantity,
              productInventoryItem: productInventoryItem.id,
              addedBy: currentOrder?.sales?.id,
              businessLocation: currentOrder?.businessLocation?.id,
              tenant: currentOrder.tenant.id,
              itemCost: productOrderItem?.price,
              itemVendor: currentOrder?.company?.id ?? null,
              itemContactVendor: currentOrder?.contact?.id ?? null,
              memo: !!currentOrder?.memo,
              expiryDate: currentOrder?.memo
                ? new Date(Date.now() + currentOrder.memo * 24 * 60 * 60 * 1000)
                : null,
              receiveDate: new Date(),
            },
          },
        );
      },
    );

    await Promise.all(productUpdates);
  }

  if (
    receiveEvents?.length > 0 &&
    currentOrder.status === 'received' &&
    data.status !== 'received' &&
    data.status !== undefined
  ) {
    await Promise.all(
      receiveEvents?.map(async (event) => {
        await strapi.entityService.update(
          'api::product-inventory-item.product-inventory-item',
          event?.productInventoryItem?.id,
          {
            data: {
              quantity:
                event?.productInventoryItem?.quantity - Number(event?.change),
            },
          },
        );

        await strapi.entityService.delete(
          'api::product-inventory-item-event.product-inventory-item-event',
          event.id,
        );

        //check total quantity of product inventory item (PITTQ) and total quantity of sublocation items from this product inventory item (SITQ)
        //(PITTQ < SITQ) remove one item from sublocations

        const productInventoryItem = await strapi.entityService.findOne(
          'api::product-inventory-item.product-inventory-item',
          event?.productInventoryItem?.id,
          {
            fields: ['id', 'quantity'],
          },
        );

        if (productInventoryItem) {
          const sublocationItems = await strapi.entityService.findMany(
            'api::sublocation-item.sublocation-item',
            {
              filters: {
                productInventoryItem: {
                  id: { $eq: event?.productInventoryItem?.id },
                },
              },
              fields: ['id', 'quantity'],
            },
          );
          const totalQntySubItem = sublocationItems.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          if (productInventoryItem?.quantity < totalQntySubItem) {
            const sublocationItemLast = last(sublocationItems);

            if (sublocationItemLast) {
              const checkQnty =
                sublocationItemLast?.quantity -
                  (totalQntySubItem - productInventoryItem?.quantity) <
                0
                  ? 0
                  : sublocationItemLast?.quantity -
                    (totalQntySubItem - productInventoryItem?.quantity);

              await strapi.entityService.update(
                'api::sublocation-item.sublocation-item',
                sublocationItemLast?.id,
                {
                  data: {
                    quantity: checkQnty,
                  },
                },
              );
            }
          }
        }
      }),
    );
  }

  if (
    currentOrder?.dealTransactions?.length === 0 &&
    data.status === 'received'
  ) {
    const cashPaymentMethod = await strapi.entityService.findMany(
      'api::payment-method.payment-method',
      {
        filters: {
          name: {
            $eq: 'cash',
          },
          tenant: {
            id: {
              $eq: currentOrder.tenant.id,
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
          sellingOrder: currentOrder.id,
          summary: currentOrder.total,
          paid: 0,
          status: 'Open',
          dueDate: new Date(),
          repetitive: 'once',
          dealTransactionId: generateId(),
          tenant: currentOrder.tenant.id,
          chartAccount: chartAccounts?.[0]?.id,
          paymentMethod: cashPaymentMethod?.[0]?.id,
          businessLocation: currentOrder?.businessLocation?.id,
        },
      },
    );
  }
};
