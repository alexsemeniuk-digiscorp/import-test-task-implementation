/**
 * product-setting service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::product-setting.product-setting',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::product-setting.product-setting',
        id,
        { ...params },
      );
    },
    async findMany(id: number, params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::product-setting.product-setting',
        { ...params },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::product-setting.product-setting',
        id,
      );
    },
  }),
);
