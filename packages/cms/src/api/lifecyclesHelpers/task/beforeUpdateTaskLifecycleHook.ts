import { LifecycleHook } from '../types';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { handleSendNotification } from './beforeUpdate/handleSendNotification';
import { updatedCompletedDate } from './beforeUpdate/updateCompletedDate';

export const beforeUpdateTaskLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'TASK beforeUpdateTaskLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const taskID = event?.params?.where?.id;

  const newCompletedStatus =
    event?.params?.data?.completed ?? event.params?.data?.data?.completed;

  if (!taskID) return;

  const task = await strapi.entityService.findOne('api::task.task', taskID, {
    fields: ['completed'],
  });

  if (!task)
    return handleError(
      'TASK beforeUpdateTaskLifecycleHook',
      `Task ${taskID} was not found`,
    );

  if (newCompletedStatus != null && newCompletedStatus !== task.completed) {
    await updatedCompletedDate(event, task);
  }

  try {
    await handleSendNotification(event, task);
  } catch (e) {
    console.log('Error while sending notification', e);
  }
};
