/**
 * resource-inventory-item service
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::resource-inventory-item.resource-inventory-item',
  ({ strapi }) => ({
    async findRelatedCounts(id?: number) {
      if (!id) {
        return [];
      }

      const resourceCounts = await strapi.entityService.findMany(
        'api::resource-count.resource-count',
        {
          filters: {
            resourceInventoryItem: {
              id,
            },
          },
        },
      );

      return resourceCounts || [];
    },
  }),
);
