/**
 * user-notification service
 */

import { factories } from '@strapi/strapi';
import { NexusGenEnums } from '../../../types/generated/graphql';
import { SocketIo } from '../../socket/SocketIo';

interface AdditionalData {
  inventoryQuantityNotification?: number;
  maintenanceQuantityNotification?: number;
  nylasGrantExpire?: number;
}

export default factories.createCoreService(
  'api::user-notification.user-notification',
  () => ({
    async createUserNotification(
      userId: number,
      type: NexusGenEnums['ENUM_USERNOTIFICATION_TYPE'],
      additionalData?: AdditionalData,
    ): Promise<void> {
      const notification = await strapi.entityService.create(
        'api::user-notification.user-notification',
        {
          data: {
            user: userId,
            type,
            ...additionalData,
          },
        },
      );

      this.sendNotificationToUser(userId, String(notification.id));
    },
    sendNotificationToUser(userId: number, notificationId: string): void {
      SocketIo.emitToUser(userId, 'notification-created', {
        notificationId,
      });
    },
    async createTenantNotifications(
      tenantId: number,
      type: NexusGenEnums['ENUM_USERNOTIFICATION_TYPE'],
      additionalData?: AdditionalData,
    ): Promise<void> {
      const users = await strapi.entityService.findMany(
        'plugin::users-permissions.user',
        {
          filters: {
            tenant: {
              id: {
                $eq: tenantId,
              },
            },
            role: {
              name: {
                $in: ['Owner', 'Employee'],
              },
            },
          },
          fields: ['id'],
        },
      );

      await Promise.all(
        users?.map((user) =>
          this.createUserNotification(user.id, type, additionalData),
        ) || [],
      );
    },
  }),
);
