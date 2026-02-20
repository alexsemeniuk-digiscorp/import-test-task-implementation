/**
 * inventory-audit service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::inventory-audit.inventory-audit',
  () => ({
    async findOne(id: number, params: AnyObject) {
      return await strapi.entityService.findOne(
        'api::inventory-audit.inventory-audit',
        id,
        { ...params },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::inventory-audit.inventory-audit',
        { ...params },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::inventory-audit.inventory-audit',
        { data: { ...create } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::inventory-audit.inventory-audit',
        id,
      );
    },
    async update(id: number, update: AnyObject) {
      return await strapi.entityService.update(
        'api::inventory-audit.inventory-audit',
        id,
        { data: { ...update } },
      );
    },
  }),
);
