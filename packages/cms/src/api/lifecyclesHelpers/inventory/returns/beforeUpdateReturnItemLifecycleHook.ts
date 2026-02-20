import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';
import { updateQuantityOnPartialReturnItemUpdate } from './updateQuantityOnPartialReturnItemUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateReturnItemLifecycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'RETURN iteM beforeUpdateReturnItemLifecycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await updateQuantityOnPartialReturnItemUpdate({ ...event });
};
