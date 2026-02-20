/**
 * deal-transaction service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::deal-transaction.deal-transaction',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::deal-transaction.deal-transaction',
        id,
        { ...params },
      );
    },
    async findMany(params) {
      return await strapi.entityService.findMany(
        'api::deal-transaction.deal-transaction',
        {
          ...params,
        },
      );
    },
    async create(create) {
      return await strapi.entityService.create(
        'api::deal-transaction.deal-transaction',
        { data: { ...create } },
      );
    },
  }),
);
