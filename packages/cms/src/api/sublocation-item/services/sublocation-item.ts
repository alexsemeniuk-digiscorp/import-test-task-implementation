/**
 * sublocation-item service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::sublocation-item.sublocation-item',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::sublocation-item.sublocation-item',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::sublocation-item.sublocation-item',
        { ...params },
      );
    },
    async update(id: number, update: AnyObject) {
      return await strapi.entityService.update(
        'api::sublocation-item.sublocation-item',
        id,
        { data: { ...update } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::sublocation-item.sublocation-item',
        id,
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::sublocation-item.sublocation-item',
        { data: { ...create } },
      );
    },
  }),
);
