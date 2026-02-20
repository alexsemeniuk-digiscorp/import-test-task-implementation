import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deletePayRate = async (event: BeforeLifecycleEvent) => {
  const deletedUser = event.params?.where?.id;

  if (!deletedUser) return;

  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { id: deletedUser },
    populate: { payRate: true },
  });

  if (user?.payRate?.id) {
    await strapi.entityService.delete(
      'api::pay-rate.pay-rate',
      user.payRate.id,
    );
  }
};
