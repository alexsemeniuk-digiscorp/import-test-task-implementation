import { handleLogger } from '../../../../graphql/helpers/errors';
import { updateQuantityOnPartialReturnItemDelete } from '../../../lifecyclesHelpers/inventory/returns/updateQuantityOnPartialReturnItemDelete';
import { LifecycleHook } from '../../types';

export const beforeDeleteReturnItemEventLifecycleHook: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'RETURN ITEM beforeDeleteReturnItemEventLifecycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await updateQuantityOnPartialReturnItemDelete({ ...event });
};
