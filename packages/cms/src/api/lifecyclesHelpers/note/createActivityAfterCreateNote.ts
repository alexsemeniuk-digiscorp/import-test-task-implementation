import { handleLogger } from '../../../graphql/helpers/errors';
import { createActivity } from '../activity/createActivity';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createActivityAfterCreateNote: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  // Skip create activity after create note during bulk imports for performance
  if (event?.params?.data?._skipCreateActivityAfterCreateNote) {
    delete event?.params?.data?._skipCreateActivityAfterCreateNote;
    return;
  }

  handleLogger(
    'info',
    'Note afterCreateNoteLifeCycleHook createActivityAfterCreateNote',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await createActivity(event, 'note');
};
