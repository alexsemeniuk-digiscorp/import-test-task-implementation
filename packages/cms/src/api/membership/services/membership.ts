/**
 * membership service
 */
import { factories } from '@strapi/strapi';

import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { getSoldOrderItemFilterByPeriod } from '../../helpers/orderItem';

export default factories.createCoreService(
  'api::membership.membership',
  () => ({
    async getSoldRevenue(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const filter = getSoldOrderItemFilterByPeriod(startDate, endDate);
      const membershipOrderItems = await strapi.entityService.findMany(
        'api::membership-order-item.membership-order-item',
        {
          filters: {
            ...filter,
            membership: {
              id: {
                $eq: id,
              },
            },
            ...(businessLocationId
              ? {
                  order: {
                    ...filter.order,
                    businessLocation: {
                      id: {
                        $eq: businessLocationId,
                      },
                    },
                  },
                }
              : {}),
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
        membershipOrderItems?.reduce((total, membershipOrderItem) => {
          return (
            total +
            discountService.getDiscountedPriceForOrderItem(
              membershipOrderItem?.price,
              membershipOrderItem?.quantity,
              membershipOrderItem?.discounts,
              membershipOrderItem?.order,
            )
          );
        }, 0) || 0
      );
    },
  }),
);
