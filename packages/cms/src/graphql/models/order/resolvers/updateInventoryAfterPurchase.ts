import { GraphQLFieldResolver } from 'graphql';

import { generateId } from '../../../../utils/randomBytes';
import { UpdateInventoryAfterPurchaseInput } from '../order.types';

export const updateInventoryAfterPurchase: GraphQLFieldResolver<
  null,
  null,
  { input: UpdateInventoryAfterPurchaseInput }
> = async (root, { input }, ctx) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    {
      fields: ['id', 'memo'],
      populate: {
        products: {
          fields: ['id', 'price'],
          populate: {
            product: {
              fields: ['id', 'quantity'],
            },
          },
        },
        contact: {
          fields: ['id'],
        },
        company: {
          fields: ['id'],
        },
        sales: {
          fields: ['id'],
        },
        businessLocation: {
          fields: ['id'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  if (!order) {
    throw new Error(`Order with ID ${input.orderId} not found`);
  }

  const chartAccounts = await strapi.entityService.findMany(
    'api::chart-account.chart-account',
    {
      filters: {
        name: 'Cost of Goods Sold',
      },
      fields: ['id'],
    },
  );

  const productUpdates = input.products.map(async (productUpdate) => {
    const orderProductItem = order.products.find(
      (product) => product.id === Number(productUpdate.id),
    );

    if (!orderProductItem) {
      throw new Error(
        `Order product item with ID ${productUpdate.id} not found`,
      );
    }

    const productInventoryItem = orderProductItem.product;

    if (!productInventoryItem) {
      throw new Error(
        `Product inventory item for order product item with ID ${productUpdate.id} not found`,
      );
    }

    // Update the order-product-item quantity
    await strapi.entityService.update(
      'api::product-order-item.product-order-item',
      orderProductItem.id,
      {
        data: {
          quantity: productUpdate.quantity,
        },
      },
    );

    // Update the product-inventory-item quantity
    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      productInventoryItem.id,
      {
        data: {
          quantity: productInventoryItem.quantity + productUpdate.quantity,
        },
      },
    );

    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'receive',
          change: productUpdate?.quantity?.toString(),
          remainingQuantity: productUpdate?.quantity,
          productInventoryItem: productInventoryItem.id,
          addedBy: order?.sales?.id,
          businessLocation: order?.businessLocation?.id,
          tenant: order.tenant.id,
          itemCost: orderProductItem?.price,
          itemVendor: order?.company?.id ?? null,
          memo: !!order?.memo,
          expiryDate: order?.memo
            ? new Date(Date.now() + order.memo * 24 * 60 * 60 * 1000)
            : null,
          receiveDate: new Date(),
        },
      },
    );
  });

  // Execute all the updates
  await Promise.all(productUpdates);

  const orderUpdated = await strapi.entityService.update(
    'api::order.order',
    input.orderId,
    {
      data: {
        status: 'received',
      },
    },
  );

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

  await strapi.entityService.create('api::deal-transaction.deal-transaction', {
    data: {
      sellingOrder: orderUpdated.id,
      summary: orderUpdated.total,
      paid: orderUpdated.total,
      status: 'Open',
      dueDate: new Date(),
      repetitive: 'once',
      dealTransactionId: generateId(),
      tenant: order.tenant.id,
      chartAccount: chartAccounts?.[0]?.id,
      paymentMethod: cashPaymentMethod?.[0]?.id,
    },
  });
};
