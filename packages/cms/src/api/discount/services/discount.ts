/**
 * discount service
 */
import { factories } from '@strapi/strapi';

import { NexusGenRootTypes } from '../../../types/generated/graphql';
import { DiscountProductType } from '../types';
import { getItemsUuids } from './helpers/getItemsUuids';

export default factories.createCoreService(
  'api::discount.discount',
  ({ strapi }) => ({
    async getUsagesLeft(id: number) {
      const discount = await strapi.entityService.findOne(
        'api::discount.discount',
        id,
        {
          populate: ['discountUsageEvents'],
        },
      );

      if (!discount || !discount.usageLimit) {
        return -1; // -1 means unlimited
      }

      const usedCount = discount.discountUsageEvents?.length || 0;

      return discount.usageLimit - usedCount;
    },
    async isActive(id: number) {
      const discount = await strapi.entityService.findOne(
        'api::discount.discount',
        id,
      );

      if (!discount || !discount.active) {
        return false;
      }

      const now = new Date().setHours(0, 0, 0, 0); // to compare only dates
      const startDate = new Date(discount?.startDate ?? now).setHours(
        0,
        0,
        0,
        0,
      );
      const endDate = new Date(discount?.endDate ?? now).setHours(0, 0, 0, 0);

      const hasSufficientStartDate = startDate <= now;
      const hasSufficientEndDate = endDate >= now;

      return hasSufficientStartDate && hasSufficientEndDate;
    },
    async canDiscountBeUsed(id: number) {
      // for usage in orders
      const isActive = await this.isActive(id);
      const usagesLeft = await this.getUsagesLeft(id);

      return isActive && usagesLeft !== 0;
    },
    async isUniversal(id: number) {
      const discount = await strapi.entityService.findOne(
        'api::discount.discount',
        id,
        {
          fields: ['id'],
          populate: {
            applicableProducts: {
              fields: ['id'],
            },
            applicableCompositeProducts: {
              fields: ['id'],
            },
            applicableServices: {
              fields: ['id'],
            },
            applicableMemberships: {
              fields: ['id'],
            },
            applicableClasses: {
              fields: ['id'],
            },
            excludedProducts: {
              fields: ['id'],
            },
            excludedCompositeProducts: {
              fields: ['id'],
            },
            excludedServices: {
              fields: ['id'],
            },
            excludedMemberships: {
              fields: ['id'],
            },
            excludedClasses: {
              fields: ['id'],
            },
          },
        },
      );

      const hasApplicableItems =
        discount?.applicableProducts?.length ||
        discount?.applicableServices?.length ||
        discount?.applicableClasses?.length ||
        discount?.applicableMemberships?.length ||
        discount?.applicableCompositeProducts?.length;

      const hasExcludedItems =
        discount?.excludedProducts?.length ||
        discount?.excludedServices?.length ||
        discount?.excludedClasses?.length ||
        discount?.excludedMemberships?.length ||
        discount?.excludedCompositeProducts?.length;

      return !hasApplicableItems && !hasExcludedItems;
    },
    async getApplicableItems(
      id: number,
      orderId: number,
      productType?: DiscountProductType,
    ) {
      const isUniversal = await this.isUniversal(id);
      const discount = await strapi.entityService.findOne(
        'api::discount.discount',
        id,
        {
          fields: ['id', 'type'],
          populate: {
            applicableProducts: {
              fields: ['id', 'uuid'],
            },
            applicableCompositeProducts: {
              fields: ['id', 'uuid'],
            },
            applicableServices: {
              fields: ['id', 'uuid'],
            },
            applicableMemberships: {
              fields: ['id', 'uuid'],
            },
            applicableClasses: {
              fields: ['id', 'uuid'],
            },
            excludedProducts: {
              fields: ['id', 'uuid'],
            },
            excludedCompositeProducts: {
              fields: ['id', 'uuid'],
            },
            excludedServices: {
              fields: ['id', 'uuid'],
            },
            excludedMemberships: {
              fields: ['id', 'uuid'],
            },
            excludedClasses: {
              fields: ['id', 'uuid'],
            },
          },
        },
      );
      const order = await strapi.entityService.findOne(
        'api::order.order',
        orderId,
        {
          populate: {
            products: {
              fields: ['id'],
              populate: {
                product: {
                  fields: ['id'],
                  populate: {
                    product: {
                      fields: ['id', 'uuid'],
                    },
                  },
                },
              },
            },
            compositeProducts: {
              fields: ['id', 'itemId'],
            },
            services: {
              fields: ['id'],
              populate: {
                service: {
                  fields: ['id'],
                  populate: {
                    serviceLocationInfo: {
                      fields: ['id'],
                      populate: {
                        service: {
                          fields: ['id', 'uuid'],
                        },
                      },
                    },
                  },
                },
              },
            },
            memberships: {
              fields: ['id', 'itemId'],
            },
            classes: {
              fields: ['id'],
              populate: {
                class: {
                  fields: ['id'],
                  populate: {
                    classLocationInfo: {
                      fields: ['id'],
                      populate: {
                        class: {
                          fields: ['id', 'uuid'],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      );

      const { products, compositeProducts, classes, services, memberships } =
        order;
      const {
        applicableProducts,
        applicableServices,
        applicableClasses,
        applicableCompositeProducts,
        applicableMemberships,
        excludedProducts,
        excludedClasses,
        excludedServices,
        excludedCompositeProducts,
        excludedMemberships,
        type,
      } = discount;

      if (isUniversal && (type === 'percentage' || type === 'fixed')) {
        return {
          ['product']: [...products],
          ['class']: [...classes],
          ['composite-product']: [...compositeProducts],
          ['service']: [...services],
          ['membership']: [...memberships],
        };
      }

      if (
        excludedProducts.length ||
        excludedClasses.length ||
        excludedServices.length ||
        excludedCompositeProducts.length ||
        excludedMemberships.length
      ) {
        //get excluded items' uuids
        const excludedProductUuids = getItemsUuids(excludedProducts);
        const excludedClassesUuids = getItemsUuids(excludedClasses);
        const excludedServicesUuids = getItemsUuids(excludedServices);
        const excludedCompositeProductsUuids = getItemsUuids(
          excludedCompositeProducts,
        );
        const excludedMembershipsUuids = getItemsUuids(excludedMemberships);

        //get applicable order items
        const orderNonExcludedProducts = [...products].filter(
          (product) =>
            !excludedProductUuids.includes(product.product.product.uuid),
        );

        const orderNonExcludedClasses = [...classes].filter(
          (item) =>
            !excludedClassesUuids.includes(
              item.class.classLocationInfo.class.uuid,
            ),
        );

        const orderNonExcludedServices = [...services].filter(
          (item) =>
            !excludedServicesUuids.includes(
              item.service.serviceLocationInfo.service.uuid,
            ),
        );

        const orderNonExcludedMemberships = [...memberships].filter(
          (item) => !excludedMembershipsUuids.includes(item.itemId),
        );

        switch (productType) {
          case 'products':
            return [...orderNonExcludedProducts];
          case 'classes':
            return [...orderNonExcludedClasses];
          case 'services':
            return [...orderNonExcludedServices];
          case 'memberships':
            return [...orderNonExcludedMemberships];
          default:
            return [
              ...orderNonExcludedProducts,
              ...orderNonExcludedClasses,
              ...orderNonExcludedServices,
              ...orderNonExcludedMemberships,
            ];
        }
      }

      if (
        applicableProducts.length ||
        applicableClasses.length ||
        applicableServices.length ||
        applicableCompositeProducts.length ||
        applicableMemberships.length
      ) {
        // get applicable order items' uuids
        const applicableProductsUuids = getItemsUuids(applicableProducts);
        const applicableClassesUuids = getItemsUuids(applicableClasses);
        const applicableServicesUuids = getItemsUuids(applicableServices);
        const applicableMembershipsUuids = getItemsUuids(applicableMemberships);
        const applicableCompositeProductsUuids = getItemsUuids(
          applicableCompositeProducts,
        );

        //get applicable order items
        const orderApplicableProducts = [...products].filter((product) =>
          applicableProductsUuids.includes(product.product.product.uuid),
        );

        const orderApplicableClasses = [...classes].filter((item) =>
          applicableClassesUuids.includes(
            item.class.classLocationInfo.class.uuid,
          ),
        );

        const orderApplicableServices = [...services].filter((item) =>
          applicableServicesUuids.includes(
            item.service.serviceLocationInfo.service.uuid,
          ),
        );

        const orderApplicableMemberships = [...memberships].filter((item) =>
          applicableMembershipsUuids.includes(item.itemId),
        );

        const orderApplicableCompositeProducts = [...compositeProducts].filter(
          (item) => applicableCompositeProductsUuids.includes(item.itemId),
        );

        switch (productType) {
          case 'products':
            return [...orderApplicableProducts];
          case 'classes':
            return [...orderApplicableClasses];
          case 'services':
            return [...orderApplicableServices];
          case 'memberships':
            return [...orderApplicableMemberships];
          case 'compositeProducts':
            return [...orderApplicableCompositeProducts];
          default:
            return [
              ...orderApplicableProducts,
              ...orderApplicableClasses,
              ...orderApplicableServices,
              ...orderApplicableMemberships,
            ];
        }
      }
    },
    getDiscountAmount(
      price: number,
      discountType: 'percentage' | 'fixed',
      discountAmount: number,
      discount: any,
      order: NexusGenRootTypes['Order'],
    ) {
      const {
        applicableProducts = [],
        applicableServices = [],
        applicableClasses = [],
        applicableMemberships = [],
        applicableCompositeProducts = [],
        excludedProducts = [],
        excludedServices = [],
        excludedClasses = [],
        excludedMemberships = [],
        excludedCompositeProducts = [],
      } = discount;

      const hasApplicableItems =
        applicableProducts.length ||
        applicableServices.length ||
        applicableClasses.length ||
        applicableMemberships.length ||
        applicableCompositeProducts.length;

      const hasExcludedItems =
        excludedProducts.length ||
        excludedServices.length ||
        excludedClasses.length ||
        excludedMemberships.length ||
        excludedCompositeProducts.length;

      const isUniversal = !hasApplicableItems && !hasExcludedItems;

      switch (discountType) {
        case 'percentage':
          return (price * discountAmount) / 100;
        case 'fixed':
          if (isUniversal && order?.subTotal > 0) {
            const proportion = price / order?.subTotal;
            return parseFloat((discountAmount * proportion).toFixed(2));
          } else {
            return discountAmount;
          }
        default:
          return 0;
      }
    },
    getDiscountAmountSumForOrderItem(
      price: number,
      quantity = 1,
      discounts?: NexusGenRootTypes['Discount'][],
      order?: NexusGenRootTypes['Order'],
    ) {
      const discountAmounts = discounts?.map((discount) => {
        return (
          this.getDiscountAmount(
            price,
            discount.type,
            discount.amount ?? 0,
            discount,
            order,
          ) * quantity
        );
      });

      return discountAmounts?.reduce((acc, curr) => acc + curr, 0) ?? 0;
    }, // will use it for order discount calculation
    getDiscountedPriceForOrderItem(
      price: number,
      quantity = 1,
      discounts?: NexusGenRootTypes['Discount'][],
      order?: NexusGenRootTypes['Order'],
    ) {
      const discountAmountsSum = this.getDiscountAmountSumForOrderItem(
        price,
        quantity,
        discounts,
        order,
      );

      return price * quantity - discountAmountsSum;
    },
  }),
);
