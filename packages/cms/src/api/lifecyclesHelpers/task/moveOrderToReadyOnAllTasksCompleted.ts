export const moveOrderToReadyOnAllTasksCompleted = async (task) => {
  if (!task?.completed) {
    return;
  }

  if (!task?.order?.id) {
    return;
  }

  const order = await strapi.entityService.findOne(
    'api::order.order',
    task.order.id,
    {
      fields: ['id', 'status', 'type'],
      populate: {
        tasks: {
          fields: ['id', 'completed'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  if (order?.type !== 'sell') return;

  if (order?.status === 'ready' || order?.status === 'shipped') {
    return;
  }

  const allTasksCompleted = order?.tasks?.every((t) => t.completed);

  if (!allTasksCompleted) {
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

  await strapi.entityService.update('api::order.order', order.id, {
    data: { status: 'ready' },
  });
};
