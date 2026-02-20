import { GraphQLFieldResolver } from 'graphql';
import { OrderDiscountInput } from '../order.types';

export const removeDiscount: GraphQLFieldResolver<
  null,
  null,
  { input: OrderDiscountInput }
> = async (root, { input }, ctx, info) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    {
      populate: [
        'services',
        'services.service',
        'services.service.serviceLocationInfo.service',
        'classes',
        'classes.price',
        'classes.class',
        'classes.class.classLocationInfo.class',
        'products',
        'products.product',
        'products.product.product',
        'compositeProducts',
        'memberships',
        'discounts',
        'products.tax',
        'classes.tax',
        'services.tax',
        'compositeProducts.tax',
        'memberships.tax',
        'products.discounts',
        'classes.discounts',
        'services.discounts',
        'compositeProducts.discounts',
        'memberships.discounts',
      ],
    },
  );

  // Check if the discount is applied to the order
  const appliedDiscount = order.discounts.find(
    (discount) => Number(discount.id) === Number(input.id),
  );

  if (!appliedDiscount) {
    throw new Error('This discount is not applied to the order.');
  }

  const isDiscountUniversal = await strapi
    .service('api::discount.discount')
    .isUniversal(input.id);

  const applicableOrderItems = await strapi
    .service('api::discount.discount')
    .getApplicableItems(input.id, input.orderId);

  if (isDiscountUniversal) {
    // Remove discount from order items
    await Promise.all(
      Object.keys(applicableOrderItems).map((key) => {
        switch (key) {
          case 'product':
            return applicableOrderItems?.[key]?.map(async ({ id }) => {
              const existingProduct = await strapi.entityService.findOne(
                'api::product-order-item.product-order-item',
                id,
                { populate: ['discounts'] },
              );
              const productDiscounts =
                existingProduct?.discounts?.map(({ id }) => id) ?? [];
              const updatedDiscounts = productDiscounts.filter(
                (d) => Number(d) !== Number(input.id),
              );

              await strapi.entityService.update(
                'api::product-order-item.product-order-item',
                id,
                {
                  data: {
                    discounts: updatedDiscounts,
                  },
                },
              );
            });
          case 'class':
            return applicableOrderItems[key]?.map(async ({ id }) => {
              const existingClass = await strapi.entityService.findOne(
                'api::class-order-item.class-order-item',
                id,
                { populate: ['discounts'] },
              );
              const classDiscounts =
                existingClass?.discounts?.map(({ id }) => id) ?? [];
              const updatedDiscounts = classDiscounts.filter(
                (d) => Number(d) !== Number(input.id),
              );

              await strapi.entityService.update(
                'api::class-order-item.class-order-item',
                id,
                {
                  data: {
                    discounts: updatedDiscounts,
                  },
                },
              );
            });
          case 'service':
            return applicableOrderItems[key]?.map(async ({ id }) => {
              const existingService = await strapi.entityService.findOne(
                'api::service-order-item.service-order-item',
                id,
                { populate: ['discounts'] },
              );
              const serviceDiscounts =
                existingService?.discounts?.map(({ id }) => id) ?? [];
              const updatedDiscounts = serviceDiscounts.filter(
                (d) => Number(d) !== Number(input.id),
              );

              await strapi.entityService.update(
                'api::service-order-item.service-order-item',
                id,
                {
                  data: {
                    discounts: updatedDiscounts,
                  },
                },
              );
            });
          case 'membership':
            return applicableOrderItems[key]?.map(async ({ id }) => {
              const existingMembership = await strapi.entityService.findOne(
                'api::membership-order-item.membership-order-item',
                id,
                { populate: ['discounts'] },
              );
              const membershipDiscounts =
                existingMembership?.discounts?.map(({ id }) => id) ?? [];
              const updatedDiscounts = membershipDiscounts.filter(
                (d) => Number(d) !== Number(input.id),
              );

              await strapi.entityService.update(
                'api::membership-order-item.membership-order-item',
                id,
                {
                  data: {
                    discounts: updatedDiscounts,
                  },
                },
              );
            });
          case 'composite-product':
            return applicableOrderItems[key]?.map(async ({ id }) => {
              const existingCompositeProduct =
                await strapi.entityService.findOne(
                  'api::composite-product-order-item.composite-product-order-item',
                  id,
                  { populate: ['discounts'] },
                );
              const compositeProductDiscounts =
                existingCompositeProduct?.discounts?.map(({ id }) => id) ?? [];
              const updatedDiscounts = compositeProductDiscounts.filter(
                (d) => Number(d) !== Number(input.id),
              );

              await strapi.entityService.update(
                'api::composite-product-order-item.composite-product-order-item',
                id,
                {
                  data: {
                    discounts: updatedDiscounts,
                  },
                },
              );
            });
          default:
            return Promise.resolve();
        }
      }),
    );
  }
  if (!isDiscountUniversal) {
    if (!applicableOrderItems.length) {
      throw new Error('There are no applicable order items');
    }

    const applicableOrderProducts = await strapi
      .service('api::discount.discount')
      .getApplicableItems(input.id, input.orderId, 'products');

    if (applicableOrderProducts.length) {
      await Promise.all(
        applicableOrderProducts.map(async (product) => {
          const productDiscounts =
            product?.discounts?.map(({ id }) => id) ?? [];
          const updatedDiscounts = productDiscounts.filter(
            (d) => Number(d) !== Number(input.id),
          );

          await strapi.entityService.update(
            'api::product-order-item.product-order-item',
            product?.id,
            {
              data: {
                discounts: updatedDiscounts,
              },
            },
          );
        }),
      );
    }

    const applicableOrderClasses = await strapi
      .service('api::discount.discount')
      .getApplicableItems(input.id, input.orderId, 'classes');

    if (applicableOrderClasses.length) {
      await Promise.all(
        applicableOrderClasses.map(async (classItem) => {
          const classDiscounts =
            classItem?.discounts?.map(({ id }) => id) ?? [];
          const updatedDiscounts = classDiscounts.filter(
            (d) => Number(d) !== Number(input.id),
          );

          await strapi.entityService.update(
            'api::class-order-item.class-order-item',
            classItem?.id,
            {
              data: {
                discounts: updatedDiscounts,
              },
            },
          );
        }),
      );
    }

    const applicableOrderServices = await strapi
      .service('api::discount.discount')
      .getApplicableItems(input.id, input.orderId, 'services');

    if (applicableOrderServices.length) {
      await Promise.all(
        applicableOrderServices.map(async (service) => {
          const serviceDiscounts =
            service?.discounts?.map(({ id }) => id) ?? [];
          const updatedDiscounts = serviceDiscounts.filter(
            (d) => Number(d) !== Number(input.id),
          );

          await strapi.entityService.update(
            'api::service-order-item.service-order-item',
            service?.id,
            {
              data: {
                discounts: updatedDiscounts,
              },
            },
          );
        }),
      );
    }

    const applicableOrderMemberships = await strapi
      .service('api::discount.discount')
      .getApplicableItems(input.id, input.orderId, 'memberships');

    if (applicableOrderMemberships.length) {
      await Promise.all(
        applicableOrderMemberships.map(async (membership) => {
          const membershipDiscounts =
            membership?.discounts?.map(({ id }) => id) ?? [];
          const updatedDiscounts = membershipDiscounts.filter(
            (d) => Number(d) !== Number(input.id),
          );

          await strapi.entityService.update(
            'api::membership-order-item.membership-order-item',
            membership?.id,
            {
              data: {
                discounts: updatedDiscounts,
              },
            },
          );
        }),
      );
    }
  }

  // Adjust the order total and discount amount
  return await strapi.entityService.update('api::order.order', input.orderId, {
    data: {
      discounts: order.discounts
        .filter((discount) => Number(discount.id) !== Number(input.id))
        .map((el) => el.id),
    },
  });
};
