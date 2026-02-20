import { handleLogger } from '../../../graphql/helpers/errors';
import { createActivity } from '../activity/createActivity';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createActivityAfterCreateDeal: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  handleLogger(
    'info',
    'Deal afterCreateDealLifeCycleHook createActivityAfterCreateDeal',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await createActivity(event, 'deal');
};
