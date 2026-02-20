import { LifecycleHook } from '../types';

export const deleteResourceCountOnInventoryItemDeletion: LifecycleHook =
  async ({ params }) => {
    const { where } = params;

    const { id } = where || {};

    if (!id) {
      return;
    }

    const resourceInventoryItemService = strapi.service(
      'api::resource-inventory-item.resource-inventory-item',
    );

    const relatedCounts = await resourceInventoryItemService.findRelatedCounts(
      id,
    );

    if (relatedCounts?.length > 0) {
      await Promise.all(
        relatedCounts.map(async (resourceCount) => {
          await strapi.entityService.delete(
            'api::resource-count.resource-count',
            resourceCount?.id,
          );
        }),
      );
    }
  };
