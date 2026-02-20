/**
 * composite-product service
 */
import { factories } from '@strapi/strapi';

import { AnyObject } from '../../../graphql/helpers/types';

import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { getSoldOrderItemFilterByPeriod } from '../../helpers/orderItem';

export default factories.createCoreService(
  'api::composite-product.composite-product',
  ({ strapi }) => ({
    async findOne(compositeProductId: number, params?: AnyObject) {
      return await strapi.entityService.findOne(
        'api::composite-product.composite-product',
        compositeProductId,
        {
          ...params,
        },
      );
    },
    async getSoldRevenue(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const filter = getSoldOrderItemFilterByPeriod(startDate, endDate);

      const compositeProductOrderItems = await strapi.entityService.findMany(
        'api::composite-product-order-item.composite-product-order-item',
        {
          filters: {
            ...filter,
            compositeProduct: {
              id: {
                $eq: id,
              },
            },
            order: {
              ...filter.order,
              businessLocation: {
                id: {
                  $eq: businessLocationId,
                },
              },
            },
          },
          fields: ['price', 'quantity'],
          populate: {
            order: {
              fields: ['subTotal'],
            },
            discounts: discountPopulation as any,
          },
        },
      );

      const discountService = strapi.service('api::discount.discount');

      return (
        compositeProductOrderItems?.reduce(
          (total, compositeProductOrderItem) => {
            return (
              total +
              discountService.getDiscountedPriceForOrderItem(
                compositeProductOrderItem?.price,
                compositeProductOrderItem?.quantity,
                compositeProductOrderItem?.discounts,
                compositeProductOrderItem?.order,
              )
            );
          },
          0,
        ) || 0
      );
    },
  }),
);
