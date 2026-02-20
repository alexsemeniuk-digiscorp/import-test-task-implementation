import { LifecycleHook } from '../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteMaintenanceEventsOnMaintenanceDeletion: LifecycleHook =
  async ({ params }: BeforeLifecycleEvent) => {
    const maintenanceId = params.where.id;

    const filterParams = {
      filters: {
        maintenance: {
          id: {
            $eq: maintenanceId,
          },
        },
      },
      fields: ['id'] as any,
    };

    const events = await strapi.entityService.findMany(
      'api::maintenance-event.maintenance-event',
      filterParams,
    );

    if (events.length > 0) {
      await Promise.all(
        events.map(async (item) => {
          await strapi.entityService.delete(
            'api::maintenance-event.maintenance-event',
            item.id,
          );
        }),
      );
    }
  };
