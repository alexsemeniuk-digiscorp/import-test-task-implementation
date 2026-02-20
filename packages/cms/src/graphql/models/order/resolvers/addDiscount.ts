import { GraphQLFieldResolver } from 'graphql';

import { OrderDiscountInput } from '../order.types';
import { handleError } from './../../../helpers/errors';

//TODO: Lesya - Add checks for Composite Products
export const addDiscount: GraphQLFieldResolver<
  null,
  null,
  { input: OrderDiscountInput }
> = async (root, { input }, ctx, info) => {
  try {
    const discount = await strapi.entityService.findOne(
      'api::discount.discount',
      input.id,
      {
        fields: ['id', 'usageLimit'],
      },
    );

    if (!discount) {
      throw new Error(`Discount with ID ${input.id} does not exist.`);
    }

    const isActive = await strapi
      .service('api::discount.discount')
      .isActive(input.id);
    const usagesLeft = await strapi
      .service('api::discount.discount')
      .getUsagesLeft(input.id);

    if (!isActive) {
      throw Error('This discount is deactivated!');
    }

    if (usagesLeft === 0) {
      throw new Error(
        `You have reached the limit of ${discount.usageLimit} uses.`,
      );
    }

    const order = await strapi.entityService.findOne(
      'api::order.order',
      input.orderId,
      {
        fields: ['id'],
        populate: {
          discounts: {
            fields: ['id'],
          },
        },
      },
    );
    const { usageLimit } = discount;
    const isDiscountUniversal = await strapi
      .service('api::discount.discount')
      .isUniversal(input.id);

    if (isDiscountUniversal) {
      const applicableOrderItems = await strapi
        .service('api::discount.discount')
        .getApplicableItems(input.id, input.orderId);
      // add discount to order items

      await Promise.all(
        Object.keys(applicableOrderItems).map((key) => {
          switch (key) {
            case 'product':
              applicableOrderItems[key]?.map(async ({ id }) => {
                const existingProduct = await strapi.entityService.findOne(
                  'api::product-order-item.product-order-item',
                  id,
                  {
                    fields: ['id'],
                    populate: {
                      discounts: {
                        fields: ['id'],
                      },
                    },
                  },
                );
                const productDiscounts =
                  existingProduct?.discounts?.map(({ id }) => id) ?? [];

                await strapi.entityService.update(
                  'api::product-order-item.product-order-item',
                  id,
                  {
                    data: {
                      discounts: [...productDiscounts, +input.id],
                    },
                  },
                );
              });
            //fallthrough
            case 'class':
              applicableOrderItems[key]?.map(async ({ id }) => {
                const existingClass = await strapi.entityService.findOne(
                  'api::class-order-item.class-order-item',
                  id,
                  {
                    fields: ['id'],
                    populate: {
                      discounts: {
                        fields: ['id'],
                      },
                    },
                  },
                );

                const classDiscounts =
                  existingClass?.discounts?.map(({ id }) => id) ?? [];
                await strapi.entityService.update(
                  'api::class-order-item.class-order-item',
                  id,
                  {
                    data: {
                      discounts: [...classDiscounts, +input.id],
                    },
                  },
                );
              });
            //fallthrough
            case 'service':
              applicableOrderItems[key]?.map(async ({ id }) => {
                const existingService = await strapi.entityService.findOne(
                  'api::service-order-item.service-order-item',
                  id,
                  {
                    fields: ['id'],
                    populate: {
                      discounts: {
                        fields: ['id'],
                      },
                    },
                  },
                );
                const serviceDiscounts =
                  existingService?.discounts?.map(({ id }) => id) ?? [];

                await strapi.entityService.update(
                  'api::service-order-item.service-order-item',
                  id,
                  {
                    data: {
                      discounts: [...serviceDiscounts, +input.id],
                    },
                  },
                );
              });
            //fallthrough
            case 'membership':
              applicableOrderItems[key]?.map(async ({ id }) => {
                const existingMembership = await strapi.entityService.findOne(
                  'api::membership-order-item.membership-order-item',
                  id,
                  {
                    fields: ['id'],
                    populate: {
                      discounts: {
                        fields: ['id'],
                      },
                    },
                  },
                );
                const updatedMembershipDiscounts =
                  existingMembership?.discounts?.map(({ id }) => id) ?? [];

                await strapi.entityService.update(
                  'api::membership-order-item.membership-order-item',
                  id,
                  {
                    data: {
                      discounts: [...updatedMembershipDiscounts, +input.id],
                    },
                  },
                );
              });
            //fallthrough
            case 'composite-product':
              return applicableOrderItems[key]?.map(async ({ id }) => {
                const existingCompositeProduct =
                  await strapi.entityService.findOne(
                    'api::composite-product-order-item.composite-product-order-item',
                    id,
                    {
                      fields: ['id'],
                      populate: {
                        discounts: {
                          fields: ['id'],
                        },
                      },
                    },
                  );
                const compositeProductDiscounts =
                  existingCompositeProduct?.discounts?.map(({ id }) => id) ??
                  [];

                await strapi.entityService.update(
                  'api::composite-product-order-item.composite-product-order-item',
                  id,
                  {
                    data: {
                      discounts: [...compositeProductDiscounts, +input.id],
                    },
                  },
                );
              });
            //fallthrough
            default:
              Promise.resolve();
          }
        }),
      );

      if (usageLimit !== 0) {
        await strapi.entityService.create(
          'api::discount-usage-event.discount-usage-event',
          {
            data: {
              discount: input.id,
            },
          },
        );
      }
    }
    if (!isDiscountUniversal) {
      const applicableOrderItems = await strapi
        .service('api::discount.discount')
        .getApplicableItems(input.id, input.orderId);

      if (!applicableOrderItems.length) {
        throw new Error('There are no applicable order items');
      }
      // add applied discount to order items ------
      const applicableOrderProducts = await strapi
        .service('api::discount.discount')
        .getApplicableItems(input.id, input.orderId, 'products');

      if (applicableOrderProducts.length) {
        await Promise.all(
          applicableOrderProducts.map((product) => {
            const prevDiscountsIds =
              product.discounts?.map(({ id }) => id) || [];
            return strapi.entityService.update(
              'api::product-order-item.product-order-item',
              product.id,
              {
                data: {
                  discounts: [...prevDiscountsIds, +discount.id],
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
          applicableOrderClasses.map((cls) => {
            const prevDiscountsIds = cls.discounts?.map(({ id }) => id) || [];
            return strapi.entityService.update(
              'api::class-order-item.class-order-item',
              cls.id,
              {
                data: {
                  discounts: [...prevDiscountsIds, +discount.id],
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
          applicableOrderServices.map((service) => {
            const prevDiscountsIds =
              service.discounts?.map(({ id }) => id) || [];
            return strapi.entityService.update(
              'api::service-order-item.service-order-item',
              service.id,
              {
                data: {
                  discounts: [...prevDiscountsIds, +discount.id],
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
          applicableOrderMemberships.map((membership) => {
            const prevDiscountsIds =
              membership.discounts?.map(({ id }) => id) || [];
            return strapi.entityService.update(
              'api::membership-order-item.membership-order-item',
              membership.id,
              {
                data: {
                  discounts: [...prevDiscountsIds, +discount.id],
                },
              },
            );
          }),
        );
      }
    }

    return await strapi.entityService.update(
      'api::order.order',
      input.orderId,
      {
        data: {
          discounts: [
            ...(order as any).discounts.map((el) => el.id),
            +discount.id,
          ],
        },
      },
    );
  } catch (e) {
    handleError('addDiscount', undefined, e);
  }
};
