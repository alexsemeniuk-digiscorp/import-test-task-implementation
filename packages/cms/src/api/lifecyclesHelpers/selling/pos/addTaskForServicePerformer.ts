import { handleError } from './../../../../graphql/helpers/errors';

export const addTaskForServicePerformer = async ({ params }, currentOrder) => {
  try {
    if (
      currentOrder.status === 'draft' &&
      params.data.status &&
      params.data.status !== 'draft' &&
      currentOrder.services.length > 0
    ) {
      await Promise.all(
        currentOrder.services.map(async (service) => {
          const servicePerformer = await strapi.entityService.findMany(
            'api::service-performer.service-performer',
            {
              filters: {
                uuid: service.itemId,
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

          for (let i = 0; i < service.quantity; i++) {
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
                  description: `Order: ${currentOrder?.orderId}, Price: ${service?.price}`,
                  dueDate: service?.dueDate
                    ? new Date(service?.dueDate)
                    : new Date(),
                  name: servicePerformer?.[0]?.serviceLocationInfo?.service
                    ?.name,
                  tenant: currentOrder?.tenant?.id,
                  order: currentOrder?.id,
                  serviceOrderItem: service?.id,
                },
              },
            );

            if (createdTask?.id) {
              await strapi.entityService.create('api::activity.activity', {
                data: {
                  title: createdTask?.name ?? undefined,
                  description: createdTask?.description ?? undefined,
                  notes: service?.note ?? undefined,
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
        }),
      );
    }
  } catch (e) {
    handleError('addTaskForServicePerformer', undefined, e);
  }
};
