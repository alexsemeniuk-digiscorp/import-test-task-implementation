import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const blockUserUpdateServiceUsage = async (
  event: AfterLifecycleEvent,
): Promise<void> => {
  const userId = event.params?.where?.id;
  const isUserBlocking = event.params?.data?.blocked;

  const userData = await strapi
    .query('plugin::users-permissions.user')
    .findOne({
      where: { id: userId },
      populate: ['tenant'],
    });

  if (userData && userData?.confirmed && isUserBlocking === true) {
    const currentData = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(currentData.getMonth() - 1);

    const usage = await strapi.db.query('api::usage.usage').findOne({
      where: {
        tenant: userData.tenant.id,
        currentMonth: {
          $gte: oneMonth.toISOString(),
          $lte: currentData.toISOString(),
        },
      },
    });
    if (usage) {
      await strapi.db.query('api::usage.usage').update({
        where: { id: usage.id },
        data: {
          usageCounts: {
            ...usage.usageCounts,
            userCount: usage.usageCounts.userCount - 1,
          },
        },
      });
    }

    // Check if user exists in exceeded-service and delete if found
    const exceededService = await strapi.db
      .query('api::exceeded-service.exceeded-service')
      .findOne({
        where: {
          employee: userId,
          tenant: userData.tenant.id,
        },
      });

    if (exceededService) {
      // Delete the entry since the user is now blocked
      await strapi.db.query('api::exceeded-service.exceeded-service').delete({
        where: { id: exceededService.id },
      });
    }
  }

  if (!userId) return;
};
