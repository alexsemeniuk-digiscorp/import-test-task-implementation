import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';

export const productsInventoryItemHistoryNumbers: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { id: ID }
> = async (root, { id }) => {
  if (!id) return;

  const productEvents = await strapi.entityService.findMany(
    'api::product-inventory-item-event.product-inventory-item-event',
    {
      filters: {
        productInventoryItem: { id },
        eventType: 'receive',
      },
    },
  );

  if (!productEvents || productEvents.length === 0) {
    return { owned: 0, memo: 0, laidAway: 0, purchase: 0 };
  }

  const orders: any = await strapi.entityService.findMany('api::order.order', {
    filters: {
      products: {
        product: {
          id: {
            $eq: id,
          },
        },
      },
      $or: [
        {
          type: 'layaway',
          status: { $ne: 'shipped' },
        },
        {
          type: 'purchase',
          status: { $eq: 'placed' },
        },
      ],
    },
    populate: ['products', 'products.product'],
  });

  let ownedCount = 0;
  let memoCount = 0;
  let laidAwayCount = 0;
  let purchaseCount = 0;
  const averageCost =
    productEvents.reduce((acc, cur) => acc + cur.itemCost, 0) /
      productEvents.length || 0;

  productEvents.forEach((event) => {
    if (event.memo) {
      memoCount += event.remainingQuantity;
    } else {
      ownedCount += event.remainingQuantity;
    }
  });

  if (orders.length > 0) {
    orders.forEach((order) => {
      order.products.forEach((orderProduct) => {
        if (orderProduct.product.id == id) {
          if (order.type === 'layaway') {
            laidAwayCount += orderProduct.quantity;
          } else if (order.type === 'purchase') {
            purchaseCount += orderProduct.quantity;
          }
        }
      });
    });
  }

  return {
    averageCost,
    owned: ownedCount,
    memo: memoCount,
    laidAway: laidAwayCount,
    purchase: purchaseCount,
  };
};
