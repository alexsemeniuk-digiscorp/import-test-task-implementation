import { handleLogger } from '../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updatedCompletedDate = async (
  event: BeforeLifecycleEvent,
  task,
) => {
  handleLogger(
    'info',
    'Lifecycle Helpers :: updatedCompletedDate',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const newCompletedStatus =
    event?.params?.data?.completed ?? event.params?.data?.data?.completed;

  if (newCompletedStatus === true && newCompletedStatus !== task.completed) {
    event.params.data.completedDate =
      event?.params?.data?.updatedAt ?? new Date();
  }

  if (newCompletedStatus === false && newCompletedStatus !== task.completed) {
    event.params.data.completedDate = null;
  }
};
