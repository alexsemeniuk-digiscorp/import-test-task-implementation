/**
 * inventoryAdjustment service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::inventory-adjustment.inventory-adjustment',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::inventory-adjustment.inventory-adjustment',
        id,
        { ...params },
      );
    },
    async findMany(params) {
      return await strapi.entityService.findMany(
        'api::inventory-adjustment.inventory-adjustment',
        { ...params },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::inventory-adjustment.inventory-adjustment',
        { data: { ...create } },
      );
    },
    async update(id, update: AnyObject) {
      return await strapi.entityService.update(
        'api::inventory-adjustment.inventory-adjustment',
        id,
        { data: { ...update } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::inventory-adjustment.inventory-adjustment',
        id,
      );
    },
  }),
);
