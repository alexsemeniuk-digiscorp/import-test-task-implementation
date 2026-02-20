/**
 * service-performer service
 */
import { factories } from '@strapi/strapi';

import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { getSoldOrderItemFilterByPeriod } from '../../helpers/orderItem';

export default factories.createCoreService(
  'api::service-performer.service-performer',
  ({ strapi }) => ({
    async getActualPrice(id: number) {
      const servicePerformer = await strapi.entityService.findOne(
        'api::service-performer.service-performer',
        id,
        {
          fields: ['id', 'price'],
          populate: {
            serviceLocationInfo: {
              populate: {
                service: {
                  fields: ['id', 'defaultPrice'],
                },
              },
            },
          },
        },
      );

      return (
        servicePerformer?.price ||
        servicePerformer?.serviceLocationInfo?.service?.defaultPrice ||
        0
      );
    },
    async getSoldRevenue(id: number, startDate: Date, endDate: Date) {
      const serviceOrderItems = await strapi.entityService.findMany(
        'api::service-order-item.service-order-item',
        {
          filters: {
            ...getSoldOrderItemFilterByPeriod(startDate, endDate),
            service: {
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
        serviceOrderItems?.reduce((total, serviceOrderItem) => {
          return (
            total +
            discountService.getDiscountedPriceForOrderItem(
              serviceOrderItem?.price,
              serviceOrderItem?.quantity,
              serviceOrderItem?.discounts,
              serviceOrderItem?.order,
            )
          );
        }, 0) || 0
      );
    },
  }),
);
