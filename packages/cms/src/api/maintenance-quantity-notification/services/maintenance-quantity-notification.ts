/**
 * maintenance-quantity-notification service
 */

import { factories } from '@strapi/strapi';
import { NexusGenEnums } from '../../../types/generated/graphql';

export default factories.createCoreService(
  'api::maintenance-quantity-notification.maintenance-quantity-notification',
  () => ({
    async createMaintenanceQuantityNotification(
      maintenanceId: number,
      quantity: number,
    ): Promise<void> {
      const type: NexusGenEnums['ENUM_MAINTENANCEQUANTITYNOTIFICATION_TYPE'] =
        quantity >= 1 ? 'Day' : 'NoLeft';

      const maintenance = await strapi.entityService.findOne(
        'api::maintenance.maintenance',
        maintenanceId,
        {
          populate: ['tenant'],
        },
      );

      const { tenant } = maintenance;

      if (quantity <= 1) {
        const maintenanceQuantityNotification =
          await strapi.entityService.create(
            'api::maintenance-quantity-notification.maintenance-quantity-notification',
            {
              data: {
                maintenance: maintenanceId,
                type,
              },
            },
          );

        const notificationService = strapi.service(
          'api::user-notification.user-notification',
        );

        await notificationService.createTenantNotifications(
          tenant?.id,
          'MaintenanceQuantity',
          {
            maintenanceQuantityNotification: maintenanceQuantityNotification.id,
          },
        );
      }
    },
  }),
);
