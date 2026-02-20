/**
 * chart-category service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::chart-category.chart-category',
  () => ({
    async findOne(id: number, params?: AnyObject) {
      return await strapi.entityService.findOne(
        'api::chart-category.chart-category',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::chart-category.chart-category',
        { ...params },
      );
    },
    async create(create) {
      return await strapi.entityService.create(
        'api::chart-category.chart-category',
        {
          data: { ...create },
        },
      );
    },
  }),
);
