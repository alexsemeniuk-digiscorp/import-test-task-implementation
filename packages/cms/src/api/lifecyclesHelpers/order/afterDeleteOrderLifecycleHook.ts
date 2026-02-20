import AfterLifecycleEvent = Database.AfterLifecycleEvent;
import { handleLogger } from '../../../graphql/helpers/errors';

export const afterDeleteOrderLifecycleHook: AfterLifecycleEvent = async (
  event,
) => {
  handleLogger(
    'info',
    'ORDER afterDeleteLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );
};
