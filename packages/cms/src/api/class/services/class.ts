/**
 * class service
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::class.class', () => ({
  async getSoldRevenue(
    id: number,
    startDate: Date,
    endDate: Date,
    businessLocationId?: number,
  ) {
    const classLocationInfos = await strapi.entityService.findMany(
      'api::class-location-info.class-location-info',
      {
        filters: {
          class: {
            id: {
              $eq: id,
            },
          },
          ...(businessLocationId && {
            businessLocation: {
              id: {
                $eq: businessLocationId,
              },
            },
          }),
        },
        fields: ['id'],
        populate: {
          classPerformers: {
            fields: ['id'],
          },
        },
      },
    );

    const classPerformerService = strapi.service(
      'api::class-performer.class-performer',
    );

    const revenue = await Promise.all(
      classLocationInfos?.map(async (classLocationInfo) => {
        const classPerformers = classLocationInfo?.classPerformers;

        if (!classPerformers?.length) return 0;

        const performerIds = classPerformers.map(
          (classPerformer) => classPerformer?.id,
        );

        const performersRevenue = await Promise.all(
          performerIds.map((performerId) =>
            classPerformerService.getSoldRevenue(
              performerId,
              startDate,
              endDate,
            ),
          ),
        );

        return performersRevenue.reduce(
          (acc, performerRevenue) => acc + performerRevenue,
          0,
        );
      }) || [],
    );

    return revenue.reduce((acc, revenue) => acc + revenue, 0);
  },
}));
