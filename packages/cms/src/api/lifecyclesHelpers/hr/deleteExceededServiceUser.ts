import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteExceededServiceUser = async (
  event: BeforeLifecycleEvent,
) => {
  const deletedUser = event.params?.where?.id;

  if (!deletedUser) return;

  //update service usage count
  const userService = await strapi.plugin('users-permissions').service('user');
  const userDetail = await userService.fetch(deletedUser, {
    populate: ['tenant'],
  });
  const usage = await strapi.db.query('api::usage.usage').findOne({
    where: {
      tenant: userDetail.tenant.id,
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

  //delete exceeded service user
  const exceededServiceUserData = await strapi
    .query('api::exceeded-service.exceeded-service')
    .findOne({
      where: { employee: deletedUser },
    });

  if (exceededServiceUserData) {
    await strapi.entityService.delete(
      'api::exceeded-service.exceeded-service',
      exceededServiceUserData.id,
    );
  }
};
