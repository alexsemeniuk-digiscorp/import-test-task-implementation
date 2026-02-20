/**
 * class-performer class
 */
import { factories } from '@strapi/strapi';

import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { getSoldOrderItemFilterByPeriod } from '../../helpers/orderItem';

export default factories.createCoreService(
  'api::class-performer.class-performer',
  ({ strapi }) => ({
    async getActualPrice(id: number) {
      const classPerformer = await strapi.entityService.findOne(
        'api::class-performer.class-performer',
        id,
        {
          fields: ['id', 'price'],
          populate: {
            classLocationInfo: {
              fields: ['id'],
              populate: {
                class: {
                  fields: ['id', 'defaultPrice'],
                },
              },
            },
          },
        },
      );

      return (
        classPerformer?.price ||
        classPerformer?.classLocationInfo?.class?.defaultPrice ||
        0
      );
    },
    async getSoldRevenue(id: number, startDate: Date, endDate: Date) {
      const classOrderItems = await strapi.entityService.findMany(
        'api::class-order-item.class-order-item',
        {
          filters: {
            ...getSoldOrderItemFilterByPeriod(startDate, endDate),
            class: {
              id: {
                $eq: id,
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
        classOrderItems?.reduce((total, classOrderItem) => {
          return (
            total +
            discountService.getDiscountedPriceForOrderItem(
              classOrderItem?.price,
              classOrderItem?.quantity,
              classOrderItem?.discounts,
              classOrderItem?.order,
            )
          );
        }, 0) || 0
      );
    },
  }),
);
