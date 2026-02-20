/**
 * transaction service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::transaction.transaction',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::transaction.transaction',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::transaction.transaction',
        {
          ...params,
        },
      );
    },
  }),
);
