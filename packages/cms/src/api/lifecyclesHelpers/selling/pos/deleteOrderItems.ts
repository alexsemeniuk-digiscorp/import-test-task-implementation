import { handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteOrderItems = async (
  { params }: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ORDER beforeDeleteLifecycleHook deleteOrderItems',
    `Params :: ${JSON.stringify(params)}`,
  );

  if (currentOrder?.products && currentOrder?.products?.length > 0) {
    await Promise.all(
      currentOrder?.products.map(async (product) => {
        await strapi.entityService.delete(
          'api::product-order-item.product-order-item',
          product.id,
        );
      }),
    );
  }

  if (
    currentOrder?.compositeProducts &&
    currentOrder?.compositeProducts?.length > 0
  ) {
    await Promise.all(
      currentOrder?.compositeProducts.map(async (item) => {
        await strapi.entityService.delete(
          'api::composite-product-order-item.composite-product-order-item',
          item.id,
        );
      }),
    );
  }

  if (currentOrder?.services && currentOrder?.services?.length > 0) {
    await Promise.all(
      currentOrder?.services.map(async (item) => {
        await strapi.entityService.delete(
          'api::service-order-item.service-order-item',
          item.id,
        );
      }),
    );
  }

  if (currentOrder?.memberships && currentOrder?.memberships?.length > 0) {
    await Promise.all(
      currentOrder?.memberships.map(async (item) => {
        await strapi.entityService.delete(
          'api::membership-order-item.membership-order-item',
          item.id,
        );
      }),
    );
  }

  if (currentOrder?.classes && currentOrder?.classes?.length > 0) {
    await Promise.all(
      currentOrder?.classes.map(async (item) => {
        await strapi.entityService.delete(
          'api::class-order-item.class-order-item',
          item.id,
        );
      }),
    );
  }
};
