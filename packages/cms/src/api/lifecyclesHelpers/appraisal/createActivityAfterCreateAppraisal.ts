import { handleLogger } from '../../../graphql/helpers/errors';
import { createActivity } from '../activity/createActivity';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createActivityAfterCreateAppraisal: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  handleLogger(
    'info',
    'Appraisal afterCreateAppraisalLifeCycleHook createActivityAfterCreateAppraisal',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await createActivity(event, 'appraisal');
};
