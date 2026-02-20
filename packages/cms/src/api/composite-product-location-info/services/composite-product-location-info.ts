/**
 * composite-product-location-info service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::composite-product-location-info.composite-product-location-info',
  ({ strapi }) => ({
    async findOne(compositeProductId: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::composite-product-location-info.composite-product-location-info',
        compositeProductId,
        {
          ...params,
        },
      );
    },
    async getActualPrice(id: number) {
      const compositeProductLocationInfo = await strapi.entityService.findOne(
        'api::composite-product-location-info.composite-product-location-info',
        id,
        {
          fields: ['id', 'price'],
          populate: {
            compositeProduct: {
              fields: ['id', 'defaultPrice'],
            },
          },
        },
      );

      return (
        compositeProductLocationInfo?.price ||
        compositeProductLocationInfo?.compositeProduct?.defaultPrice ||
        0
      );
    },
  }),
);
