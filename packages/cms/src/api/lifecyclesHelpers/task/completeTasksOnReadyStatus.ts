export const completeTasksOnReadyStatus = async (order) => {
  if (order?.type !== 'sell') return;

  if (order?.status !== 'ready' && order?.status !== 'shipped') {
    return;
  }

  const incompleteTasks =
    order?.tasks?.filter((task) => !task?.completed) || [];

  if (incompleteTasks.length === 0) {
    return;
  }

  const orderSettings = await strapi.entityService.findMany(
    'api::order-setting.order-setting',
    {
      filters: {
        tenant: {
          id: {
            $eq: order?.tenant?.id,
          },
        },
      },
      fields: ['isAutomaticallyMoveOrderToReadyStage'],
    },
  );

  const orderSetting = orderSettings?.[0];

  if (orderSetting?.isAutomaticallyMoveOrderToReadyStage === false) {
    return;
  }

  for (const task of incompleteTasks) {
    await strapi.entityService.update('api::task.task', task.id, {
      data: { completed: true },
    });
  }
};
