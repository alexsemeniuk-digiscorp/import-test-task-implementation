/**
 * sales-item-report service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::sales-item-report.sales-item-report',
  () => ({
    async getSalesItemReportFilter({
      apiName,
      entityId,
    }: {
      apiName: string;
      entityId: number;
    }) {
      let filter = {};

      switch (apiName) {
        case 'api::product-order-item.product-order-item':
          filter = {
            productOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
          break;
        case 'api::composite-product-order-item.composite-product-order-item':
          filter = {
            compositeProductOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
          break;
        case 'api::service-order-item.service-order-item':
          filter = {
            serviceOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
          break;
        case 'api::membership-order-item.membership-order-item':
          filter = {
            membershipOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
          break;
        case 'api::class-order-item.class-order-item':
          filter = {
            classOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
          break;
        default:
          filter = {
            productOrderItem: {
              id: {
                $eq: entityId,
              },
            },
          };
      }

      return filter;
    },

    async getOrderItemFilter({ data }: { data: AnyObject }) {
      const keyToFilterMap = {
        productOrderItem: 'productOrderItem',
        compositeProductOrderItem: 'compositeProductOrderItem',
        serviceOrderItem: 'serviceOrderItem',
        membershipOrderItem: 'membershipOrderItem',
        classOrderItem: 'classOrderItem',
      };

      let filter = {};

      for (const key in keyToFilterMap) {
        if (data?.[key]) {
          filter = {
            [keyToFilterMap[key]]: {
              id: {
                $eq: data?.[key],
              },
            },
          };
          break;
        }
      }

      return filter;
    },

    async getSalesItemType({ data }: { data: AnyObject }) {
      if (data.product) {
        return 'product';
      } else if (data.service) {
        return 'service';
      } else if (data.membership) {
        return 'membership';
      } else if (data.class) {
        return 'class';
      } else if (data.compositeProduct) {
        return 'composite_product';
      }

      return null;
    },

    async calculateNewSoldAge({
      oldSoldDate,
      oldAge,
      newSoldDate,
    }: {
      oldSoldDate: string | Date;
      oldAge: number;
      newSoldDate: string | Date;
    }) {
      const msInDay = 1000 * 60 * 60 * 24;

      const oldDate = new Date(oldSoldDate);
      const newDate = new Date(newSoldDate);

      const createdAt = new Date(oldDate.getTime() - oldAge * msInDay);

      return Math.round((newDate.getTime() - createdAt.getTime()) / msInDay);
    },

    async calculateNewPurchaseAge({
      soldDate,
      newPurchaseDate,
    }: {
      soldDate: string | Date;
      newPurchaseDate: string | Date;
    }) {
      const msInDay = 1000 * 60 * 60 * 24;

      const oldSoldDate = new Date(soldDate);
      const newDate = new Date(newPurchaseDate);

      return Math.round((oldSoldDate.getTime() - newDate.getTime()) / msInDay);
    },
  }),
);
