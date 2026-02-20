/**
 * inventoryAdjustment-item service
 */
import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::inventory-adjustment-item.inventory-adjustment-item',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::inventory-adjustment-item.inventory-adjustment-item',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::inventory-adjustment-item.inventory-adjustment-item',
        {
          ...params,
        },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::inventory-adjustment-item.inventory-adjustment-item',
        { data: { ...create } },
      );
    },
    async update(id, update: AnyObject) {
      return await strapi.entityService.update(
        'api::inventory-adjustment-item.inventory-adjustment-item',
        id,
        { data: { ...update } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::inventory-adjustment-item.inventory-adjustment-item',
        id,
      );
    },
  }),
);
