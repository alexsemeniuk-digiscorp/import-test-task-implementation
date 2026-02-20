import { handleError } from './../../../../graphql/helpers/errors';

export const addTaskForServicePerformerOnOrderEdit = async (
  { params },
  currentOrder,
  currentItemData,
) => {
  // Skip add task for service performer during bulk imports for performance
  if (params?.data?._skipAddTaskForServicePerformer) {
    delete params?.data?._skipAddTaskForServicePerformer;
    return;
  }

  try {
    if (
      currentOrder.status !== 'draft' &&
      currentOrder.type !== 'tradeIn' &&
      currentOrder.type !== 'purchase'
    ) {
      const servicePerformer = await strapi.entityService.findMany(
        'api::service-performer.service-performer',
        {
          filters: {
            uuid: currentItemData.itemId,
          },
          fields: ['id'],
          populate: {
            performer: {
              fields: ['id'],
            },
            serviceLocationInfo: {
              fields: ['id'],
              populate: {
                service: {
                  fields: ['id', 'name', 'isTaskCreationEnabled'],
                },
              },
            },
          },
        },
      );

      if (
        servicePerformer?.[0]?.serviceLocationInfo?.service
          ?.isTaskCreationEnabled === false
      ) {
        return;
      }

      for (let i = 0; i < currentItemData.quantity; i++) {
        const createdTask = await strapi.entityService.create(
          'api::task.task',
          {
            data: {
              assignees: [servicePerformer?.[0]?.performer?.id],
              company: currentOrder?.company
                ? currentOrder?.company?.id
                : undefined,
              completed: false,
              contact: currentOrder?.contact
                ? currentOrder?.contact?.id
                : undefined,
              description: `Order: ${currentOrder?.orderId}, Price: ${currentItemData?.price}`,
              dueDate: currentItemData?.dueDate
                ? new Date(currentItemData?.dueDate)
                : new Date(),
              name: servicePerformer?.[0]?.serviceLocationInfo?.service?.name,
              tenant: currentOrder?.tenant?.id,
              order: currentOrder?.id,
              serviceOrderItem: currentItemData?.id,
            },
          },
        );

        if (createdTask?.id) {
          await strapi.entityService.create('api::activity.activity', {
            data: {
              title: createdTask?.name ?? undefined,
              description: createdTask?.description ?? undefined,
              notes: currentItemData?.note ?? undefined,
              order: currentOrder?.id,
              completed: createdTask?.completed ?? undefined,
              due_date: createdTask?.dueDate ?? undefined,
              priority: createdTask?.priority ?? undefined,
              assignees: [servicePerformer?.[0]?.performer?.id],
              type: 'task',
              task: createdTask?.id,
              company_id: currentOrder?.company
                ? currentOrder?.company?.id
                : undefined,
              contact_id: currentOrder?.contact
                ? currentOrder?.contact?.id
                : undefined,
              tenant: currentOrder?.tenant?.id,
            },
          });
        }
      }
    }
  } catch (e) {
    handleError('addTaskForServicePerformerOnOrderEdit', undefined, e);
  }
};
