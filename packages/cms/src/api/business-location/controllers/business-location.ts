/**
 * business-location controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::business-location.business-location',
  ({ strapi }) => ({
    async getBusinessLocationsOpenApiController(ctx) {
      try {
        const user = await strapi.plugins[
          'users-permissions'
        ].services.jwt.getToken(ctx);

        const owner = await strapi
          .query('plugin::users-permissions.user')
          .findOne({ where: { id: user?.id }, populate: ['tenant'] });
        const businessLocations = await strapi.entityService.findMany(
          'api::business-location.business-location',
          {
            filters: { tenant: { id: { $eq: owner?.tenant?.id } } },
            fields: [
              'id',
              'name',
              'email',
              'archived',
              'phoneNumber',
              'type',
              'uuid',
              'businessLocationId',
              'isSublocation',
              'reviewLink',
            ],
            populate: [],
          },
        );
        ctx.body = {
          status: 200,
          message: 'Business locations fetched successfully!',
          data: businessLocations,
        };
      } catch (error) {
        ctx.body = {
          status: 500,
          message: 'An error occurred while fetching business locations',
          error: error.message,
          data: null,
        };
      }
    },
    async getBusinessLocationByIdOpenApiController(ctx) {
      try {
        const { id, businessLocationId } = ctx.query;

        if (!id && !businessLocationId) {
          ctx.status = 400;
          ctx.body = {
            status: 400,
            message: 'Either id or businessLocationId is required',
            data: null,
          };
          return;
        }
        let businessLocation;
        const fieldsList = [
          'id',
          'name',
          'email',
          'archived',
          'phoneNumber',
          'type',
          'uuid',
          'businessLocationId',
          'isSublocation',
          'reviewLink',
        ];

        if (id) {
          businessLocation = await strapi.entityService.findOne(
            'api::business-location.business-location',
            id,
            {
              fields: fieldsList,
              populate: [],
            },
          );
        } else if (businessLocationId) {
          const businessLocations = await strapi.entityService.findMany(
            'api::business-location.business-location',
            {
              filters: { businessLocationId: { $eq: businessLocationId } },
              fields: fieldsList,
              populate: [],
            },
          );
          businessLocation = businessLocations[0];
        }
        // Check if business location exists
        if (!businessLocation) {
          ctx.body = {
            status: 200,
            message: 'Business location not found',
            data: null,
            found: false,
          };
          return;
        }

        ctx.body = {
          status: 200,
          message: 'Business location fetched successfully!',
          data: businessLocation,
          found: true,
        };
      } catch (error) {
        ctx.status = 500;
        ctx.body = {
          status: 500,
          message: 'An error occurred while fetching business location',
          error: error.message,
          data: null,
        };
      }
    },
  }),
);
