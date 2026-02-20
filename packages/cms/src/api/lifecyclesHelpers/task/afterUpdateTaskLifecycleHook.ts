import axios from 'axios';
import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { moveOrderToReadyOnAllTasksCompleted } from './moveOrderToReadyOnAllTasksCompleted';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const afterUpdateTaskLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'TASK afterUpdateTaskLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const taskID = event?.params?.where?.id;

  if (!taskID) {
    handleError(
      'TASK afterUpdateTaskLifecycleHook',
      `Task ${taskID} was not found`,
    );
    return;
  }

  const task = await strapi.entityService.findOne('api::task.task', taskID, {
    populate: [
      'contact',
      'assignees',
      'company',
      'lead',
      'taskLocation',
      'taskType',
      'forCompanies',
      'approvalMethods',
      'order',
      'taskStage',
      'businessLocation',
      'transitingTo',
      'currentVendor',
      'serviceOrderItem',
      'files',
      'activity',
      'tenant',
    ],
  });

  const zapierLinks = await strapi.entityService.findMany(
    'api::zapier-webhook.zapier-webhook',
    {
      filters: {
        tenant: {
          id: {
            $eq: task.tenant.id,
          },
        },
        type: {
          $eq: 'task',
        },
      },
      fields: ['webhook'],
    },
  );

  if (zapierLinks?.length > 0) {
    try {
      await axios.post(zapierLinks[0].webhook, task);
    } catch (error) {
      handleError(
        'TASK afterUpdateTaskLifecycleHook',
        'Error sending task to Zapier',
        error,
      );
    }
  }

  await moveOrderToReadyOnAllTasksCompleted(task);
};
