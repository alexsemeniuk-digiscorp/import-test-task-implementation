/**
 * product-order-item service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';
import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { taxPopulation } from '../../../graphql/models/tax/helpers/variables';

export default factories.createCoreService(
  'api::product-order-item.product-order-item',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::product-order-item.product-order-item',
        id,
        { ...params },
      );
    },
    async getTotalPricePerItem(id: number) {
      const productOrderItem = await strapi.entityService.findOne(
        'api::product-order-item.product-order-item',
        id,
        {
          fields: ['price', 'quantity'],
          populate: {
            tax: taxPopulation as any,
            taxCollection: {
              populate: {
                taxes: taxPopulation as any,
              },
            },
            order: {
              fields: ['total', 'tip', 'tax', 'subTotal', 'points'],
            },
            discounts: discountPopulation as any,
          },
        },
      );

      const { price, discounts, order } = productOrderItem;

      const discountService = strapi.service('api::discount.discount');

      const discountedPrice = discountService.getDiscountedPriceForOrderItem(
        price,
        1,
        discounts,
        order,
      );

      const taxService = strapi.service('api::tax.tax');

      return (
        discountedPrice +
        taxService.getOrderItemEntityTax({
          ...productOrderItem,
          quantity: 1,
        })
      );
    },
    async getTotalPrice(id: number, quantity = 1) {
      const totalPricePerItem = await this.getTotalPricePerItem(id);

      return totalPricePerItem * quantity;
    },
  }),
);
