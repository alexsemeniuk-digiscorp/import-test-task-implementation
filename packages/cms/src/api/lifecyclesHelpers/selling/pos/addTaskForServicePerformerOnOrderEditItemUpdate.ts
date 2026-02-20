import { handleError } from './../../../../graphql/helpers/errors';

export const addTaskForServicePerformerOnOrderEditItemUpdate = async (
  { params },
  currentItemData,
) => {
  try {
    if (
      currentItemData?.order?.status !== 'draft' &&
      currentItemData?.order?.type !== 'tradeIn' &&
      currentItemData?.order?.type !== 'purchase'
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

      const existingTasks: any[] = await strapi.entityService.findMany(
        'api::task.task',
        {
          filters: {
            serviceOrderItem: currentItemData.id,
          },
          fields: ['id', 'description', 'dueDate', 'note', 'name'],
          populate: {
            activity: {
              fields: ['id', 'description', 'due_date', 'notes'],
            },
          } as any,
        },
      );

      const currentQuantity = currentItemData.quantity;
      const newQuantity = params.data?.quantity ?? currentQuantity;
      const newPrice = params.data?.price ?? currentItemData.price;
      const newNote = params.data?.note ?? currentItemData.note;
      const newDueDate = params.data?.dueDate ?? currentItemData.dueDate;

      const priceChanged =
        params.data?.price !== undefined &&
        params.data?.price !== currentItemData.price;
      const noteChanged =
        params.data?.note !== undefined &&
        params.data?.note !== currentItemData.note;
      const dueDateChanged =
        params.data?.dueDate !== undefined &&
        params.data?.dueDate !== currentItemData.dueDate;

      if (newQuantity < currentQuantity) {
        const tasksToDelete = existingTasks.slice(newQuantity);

        for (const task of tasksToDelete) {
          if (task.activity?.id) {
            await strapi.entityService.delete(
              'api::activity.activity',
              task.activity.id,
            );
          }

          await strapi.entityService.delete('api::task.task', task.id);
        }
      }

      if (newQuantity > currentQuantity) {
        const tasksToCreate = newQuantity - currentQuantity;

        for (let i = 0; i < tasksToCreate; i++) {
          const createdTask = await strapi.entityService.create(
            'api::task.task',
            {
              data: {
                assignees: [servicePerformer?.[0]?.performer?.id],
                company: currentItemData?.order?.company
                  ? currentItemData?.order?.company?.id
                  : undefined,
                completed: false,
                contact: currentItemData?.order?.contact
                  ? currentItemData?.order?.contact?.id
                  : undefined,
                description: `Order: ${currentItemData?.order?.orderId}, Price: ${newPrice}`,
                dueDate: newDueDate ? new Date(newDueDate) : new Date(),
                name: servicePerformer?.[0]?.serviceLocationInfo?.service?.name,
                tenant: currentItemData?.order?.tenant?.id,
                order: currentItemData?.order?.id,
                serviceOrderItem: currentItemData?.id,
              },
            },
          );

          if (createdTask?.id) {
            await strapi.entityService.create('api::activity.activity', {
              data: {
                title: createdTask?.name ?? undefined,
                description: createdTask?.description ?? undefined,
                notes: newNote ?? undefined,
                order: currentItemData?.order?.id,
                completed: createdTask?.completed ?? undefined,
                due_date: createdTask?.dueDate ?? undefined,
                priority: createdTask?.priority ?? undefined,
                assignees: [servicePerformer?.[0]?.performer?.id],
                type: 'task',
                task: createdTask?.id,
                company_id: currentItemData?.order?.company
                  ? currentItemData?.order?.company?.id
                  : undefined,
                contact_id: currentItemData?.order?.contact
                  ? currentItemData?.order?.contact?.id
                  : undefined,
                tenant: currentItemData?.order?.tenant?.id,
              },
            });
          }
        }
      }

      if (priceChanged || noteChanged || dueDateChanged) {
        const tasksToUpdate =
          newQuantity < currentQuantity
            ? existingTasks.slice(0, newQuantity)
            : existingTasks;

        for (const task of tasksToUpdate) {
          const taskUpdateData: any = {};
          const activityUpdateData: any = {};

          if (priceChanged) {
            const newDescription = `Order: ${currentItemData?.order?.orderId}, Price: ${newPrice}`;
            taskUpdateData.description = newDescription;
            activityUpdateData.description = newDescription;
          }

          if (noteChanged) {
            taskUpdateData.note = newNote;
            activityUpdateData.notes = newNote;
          }

          if (dueDateChanged) {
            const parsedDueDate = newDueDate
              ? new Date(newDueDate)
              : new Date();
            taskUpdateData.dueDate = parsedDueDate;
            activityUpdateData.due_date = parsedDueDate;
          }

          if (Object.keys(taskUpdateData).length > 0) {
            await strapi.entityService.update('api::task.task', task.id, {
              data: taskUpdateData,
            });
          }

          if (task.activity?.id && Object.keys(activityUpdateData).length > 0) {
            await strapi.entityService.update(
              'api::activity.activity',
              task.activity.id,
              {
                data: activityUpdateData,
              },
            );
          }
        }
      }
    }
  } catch (e) {
    handleError(
      'addTaskForServicePerformerOnOrderEditItemUpdate',
      undefined,
      e,
    );
  }
};
