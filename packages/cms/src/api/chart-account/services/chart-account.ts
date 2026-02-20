/**
 * chart-account service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::chart-account.chart-account',
  () => ({
    async findOne(id: number, params?: AnyObject) {
      return await strapi.entityService.findOne(
        'api::chart-account.chart-account',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::chart-account.chart-account',
        { ...params },
      );
    },
    async create(create) {
      return await strapi.entityService.create(
        'api::chart-account.chart-account',
        {
          data: { ...create },
        },
      );
    },
  }),
);
