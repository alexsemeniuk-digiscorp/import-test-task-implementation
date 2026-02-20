/**
 * service service
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::service.service', () => ({
  async getSoldRevenue(
    id: number,
    startDate: Date,
    endDate: Date,
    businessLocationId?: number,
  ) {
    const serviceLocationInfos = await strapi.entityService.findMany(
      'api::service-location-info.service-location-info',
      {
        filters: {
          service: {
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
          servicePerformers: {
            fields: ['id'],
          },
        },
      },
    );

    const servicePerformerService = strapi.service(
      'api::service-performer.service-performer',
    );

    const revenue = await Promise.all(
      serviceLocationInfos?.map(async (serviceLocationInfo) => {
        const servicePerformers = serviceLocationInfo?.servicePerformers;

        if (!servicePerformers?.length) return 0;

        const performerIds = servicePerformers.map(
          (servicePerformer) => servicePerformer?.id,
        );

        const performersRevenue = await Promise.all(
          performerIds.map((performerId) =>
            servicePerformerService.getSoldRevenue(
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
