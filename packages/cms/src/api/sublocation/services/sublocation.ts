/**
 * sublocation service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::sublocation.sublocation',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::sublocation.sublocation',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::sublocation.sublocation',
        {
          ...params,
          populate: ['businessLocation', 'sublocationItems', 'tenant'],
        },
      );
    },
    async update(id: number, update: AnyObject) {
      return await strapi.entityService.update(
        'api::sublocation.sublocation',
        id,
        { data: { ...update } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::sublocation.sublocation',
        id,
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create('api::sublocation.sublocation', {
        data: { ...create },
      });
    },
  }),
);
