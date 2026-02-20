/**
 * inventory-quantity-notification service
 */

import { factories } from '@strapi/strapi';
import { NexusGenEnums } from '../../../types/generated/graphql';

export default factories.createCoreService(
  'api::inventory-quantity-notification.inventory-quantity-notification',
  () => ({
    async createInventoryQuantityNotification(
      productInventoryItemId: number,
      currentQuantity: number,
      tenantId: number,
    ): Promise<void> {
      const type: NexusGenEnums['ENUM_INVENTORYQUANTITYNOTIFICATION_TYPE'] =
        currentQuantity > 0 ? 'MinReached' : 'NoLeft';

      const inventoryQuantityNotification = await strapi.entityService.create(
        'api::inventory-quantity-notification.inventory-quantity-notification',
        {
          data: {
            productInventoryItem: productInventoryItemId,
            type,
          },
        },
      );

      const notificationService = strapi.service(
        'api::user-notification.user-notification',
      );

      await notificationService.createTenantNotifications(
        tenantId,
        'InventoryQuantity',
        {
          inventoryQuantityNotification: inventoryQuantityNotification.id,
        },
      );
    },
  }),
);
