/**
 * product-inventory-item service
 */
import { factories } from '@strapi/strapi';

import { getSoldOrderItemFilterByPeriod } from '../../helpers/orderItem';

import { AnyObject } from '../../../graphql/helpers/types';
import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';
import { NexusGenEnums } from '../../../types/generated/graphql';

export default factories.createCoreService(
  'api::product-inventory-item.product-inventory-item',
  () => ({
    async findOne(productInventoryItemId: number, params?: AnyObject) {
      return await strapi.entityService.findOne(
        'api::product-inventory-item.product-inventory-item',
        productInventoryItemId,
        {
          ...params,
        },
      );
    },
    async findMany(params: AnyObject) {
      return strapi.entityService.findMany(
        'api::product-inventory-item.product-inventory-item',
        {
          ...params,
        },
      );
    },
    async getActualPrice(id: number) {
      const productInventoryItem = await strapi.entityService.findOne(
        'api::product-inventory-item.product-inventory-item',
        id,
        {
          fields: ['id', 'price'],
          populate: {
            product: {
              fields: ['id', 'defaultPrice'],
            },
          },
        },
      );

      return (
        productInventoryItem?.price ||
        productInventoryItem?.product?.defaultPrice ||
        0
      );
    },
    async getSoldItems(id: number, startDate?: Date, endDate?: Date) {
      const productOrderItems = await strapi.entityService.findMany(
        'api::product-order-item.product-order-item',
        {
          filters: {
            ...getSoldOrderItemFilterByPeriod(startDate, endDate),
            product: {
              id: {
                $eq: id,
              },
            },
            $or: [
              {
                order: {
                  type: { $eq: 'sell' as NexusGenEnums['ENUM_ORDER_TYPE'] },
                },
              },
              {
                order: {
                  type: { $eq: 'layaway' as NexusGenEnums['ENUM_ORDER_TYPE'] },
                },
              },
            ],
          },
          populate: {
            order: {
              fields: ['subTotal'],
            },
            discounts: discountPopulation as any,
          },
        },
      );

      return productOrderItems;
    },
    async getQuantitySold(id: number, startDate?: Date, endDate?: Date) {
      const productOrderItems = await this.getSoldItems(id, startDate, endDate);

      return (
        productOrderItems?.reduce((total, productOrderItem) => {
          return total + productOrderItem?.quantity;
        }, 0) || 0
      );
    },
    async getSoldRevenue(id: number, startDate: Date, endDate: Date) {
      const productOrderItems = await this.getSoldItems(id, startDate, endDate);

      const discountService = strapi.service('api::discount.discount');

      return (
        productOrderItems?.reduce((total, productOrderItem) => {
          return (
            total +
            discountService.getDiscountedPriceForOrderItem(
              productOrderItem?.price,
              productOrderItem?.quantity,
              productOrderItem?.discounts,
              productOrderItem?.order,
            )
          );
        }, 0) || 0
      );
    },
    async processReturn({
      id,
      quantityReturned,
      revert, // Revert is used to revert the return, when the return item is deleted
    }: {
      id: number;
      quantityReturned: number;
      revert?: boolean;
    }) {
      const productInventoryItem = await strapi.entityService.findOne(
        'api::product-inventory-item.product-inventory-item',
        id,
        {
          fields: ['quantity'],
        },
      );

      const newQuantity = revert
        ? productInventoryItem.quantity - quantityReturned
        : productInventoryItem.quantity + quantityReturned;

      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        id,
        {
          data: {
            quantity: newQuantity,
          },
        },
      );
    },
    async getAllProductUnitsItems(tenantId: number, additionalFilters = {}) {
      const sublocationId = (additionalFilters as any)?.sublocationItems
        ?.sublocation?.id?.['$eq'];

      const productInventoryItemPopulate = sublocationId
        ? ({
            populate: {
              sublocationItems: {
                fields: ['id', 'quantity'],
                populate: {
                  sublocation: {
                    fields: ['id'],
                  },
                },
              },
            },
          } as any)
        : {};

      const productInventoryItems = await strapi.entityService.findMany(
        'api::product-inventory-item.product-inventory-item',
        {
          filters: {
            tenant: {
              id: {
                $eq: tenantId,
              },
            },
            ...additionalFilters,
          },
          fields: ['quantity'],
          ...productInventoryItemPopulate,
        },
      );

      if (sublocationId) {
        const totalQuantity = productInventoryItems.reduce(
          (acc: number, productInventoryItem: any) => {
            const sublocationItems =
              productInventoryItem?.sublocationItems || [];

            const sublocationSum = sublocationItems
              .filter(
                (sublocationItem) =>
                  sublocationItem?.sublocation?.id === Number(sublocationId),
              )
              .reduce(
                (acc: number, sublocationItem) =>
                  acc + (sublocationItem?.quantity || 0),
                0,
              );

            return acc + sublocationSum;
          },
          0,
        );

        return totalQuantity;
      } else {
        const totalQuantity = productInventoryItems?.reduce(
          (acc: number, productInventoryItem) => {
            return acc + (productInventoryItem?.quantity || 0);
          },
          0,
        );

        return totalQuantity;
      }
    },
    async update(productInventoryItemId: number, updatedData: AnyObject) {
      return await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productInventoryItemId,
        {
          data: {
            ...updatedData,
          },
        },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::product-inventory-item.product-inventory-item',
        { data: { ...create, quantity: Number(create?.quantity) ?? 0 } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::product-inventory-item.product-inventory-item',
        id,
      );
    },
  }),
);
