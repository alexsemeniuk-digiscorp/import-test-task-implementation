import { handleLogger } from '../../../../graphql/helpers/errors';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const updateOrderItemsQuantityOnFullReturn = async (
  { params }: AfterLifecycleEvent,
  currentReturn,
) => {
  handleLogger(
    'info',
    'Return afterCreateReturnLifeCycleHook updateOrderItemsQuantityOnFullReturn',
    `Params ${JSON.stringify(params)}`,
  );

  const currentOrder = currentReturn?.order;

  if (currentOrder?.products && currentOrder?.products?.length > 0) {
    await Promise.all(
      currentOrder?.products.map(async (product) => {
        if (product?.isCompositeProductItem) {
          await strapi.entityService.update(
            'api::product-order-item.product-order-item',
            product.id,
            {
              data: {
                quantity: 0,
              },
            },
          );
        }
      }),
    );
  }

  if (
    currentOrder?.compositeProducts &&
    currentOrder?.compositeProducts?.length > 0
  ) {
    await Promise.all(
      currentOrder?.compositeProducts.map(async (compositeProduct) => {
        await strapi.entityService.update(
          'api::composite-product-order-item.composite-product-order-item',
          compositeProduct.id,
          {
            data: {
              quantity: 0,
            },
          },
        );
      }),
    );
  }

  if (currentOrder?.services && currentOrder?.services?.length > 0) {
    await Promise.all(
      currentOrder?.services.map(async (service) => {
        await strapi.entityService.update(
          'api::service-order-item.service-order-item',
          service.id,
          {
            data: {
              quantity: 0,
            },
          },
        );
      }),
    );
  }

  if (currentOrder?.memberships && currentOrder?.memberships?.length > 0) {
    await Promise.all(
      currentOrder?.memberships.map(async (membership) => {
        await strapi.entityService.update(
          'api::membership-order-item.membership-order-item',
          membership.id,
          {
            data: {
              quantity: 0,
            },
          },
        );
      }),
    );
  }

  if (currentOrder?.classes && currentOrder?.classes?.length > 0) {
    await Promise.all(
      currentOrder?.classes.map(async (classItem) => {
        await strapi.entityService.update(
          'api::class-order-item.class-order-item',
          classItem.id,
          {
            data: {
              quantity: 0,
            },
          },
        );
      }),
    );
  }
};
