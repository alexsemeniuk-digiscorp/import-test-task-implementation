/**
 * inventory-audit-item service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::inventory-audit-item.inventory-audit-item',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::inventory-audit-item.inventory-audit-item',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::inventory-audit-item.inventory-audit-item',
        {
          ...params,
        },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::inventory-audit-item.inventory-audit-item',
        { data: { ...create } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::inventory-audit-item.inventory-audit-item',
        id,
      );
    },
    async update(id: number, update: AnyObject) {
      return await strapi.entityService.update(
        'api::inventory-audit-item.inventory-audit-item',
        id,
        { data: { ...update } },
      );
    },
  }),
);
