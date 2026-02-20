import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';
import { updateQuantityOnPartialReturnItemCreation } from './updateQuantityOnPartialReturnItemCreation';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterCreateReturnItemLifecycleHook: LifecycleHook = async (
  event: AfterLifecycleEvent,
) => {
  handleLogger(
    'info',
    'RETURN ITEM afterCreateReturnItemLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  await updateQuantityOnPartialReturnItemCreation({ ...event });
};
