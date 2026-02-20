export const createUsage = async (tenantId) => {
  await strapi.entityService.create('api::usage.usage', {
    data: {
      tenant: tenantId,
      currentMonth: new Date(),
      usageCounts: {
        userCount: 1,
      },
    },
  });
};
